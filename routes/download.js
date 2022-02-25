const fs = require("fs");
const express = require("express");
const ytdl = require("ytdl-core");
const axios = require("axios");
const { spawn } = require("child_process");
const path = require("path");
const router = express.Router();
router
  .route("/youtube")
  .get((req, res) => {
    res.render("home", { path: "youtube" });
  })
  .post(async (req, res) => {
    if (req.body.itag) {
      try {
        const yturl = req.body.url.toString();
        const itag = req.body.itag;
        const vid = ytdl.getURLVideoID(yturl);
        if (itag == "18") {
          try {
            let info = await ytdl.getInfo(vid);
            let format = ytdl.chooseFormat(info.formats, { quality: itag });
            const content_len = format.contentLength;
            const stream = ytdl(yturl, { quality: itag });
            res.set({ 'content-type': 'video/mp4', 'content-length': content_len, 'Content-Disposition': 'attachment' });
            res.status(200);
            stream.pipe(res);
          } catch (error) {
            console.log(error);
            res.status(400).send('error occured');
          }

        } else if (itag == "140") {
          try {
            const ytstream = ytdl(yturl, { quality: itag });
            const ffmpeg = spawn('ffmpeg', ['-i', 'pipe:3', '-vn', '-f', 'mp3', 'pipe:1'], { stdio: ['inherit', 'pipe', 'inherit', 'pipe'] });
            ytstream.pipe(ffmpeg.stdio[3]);
            res.set({ 'content-type': 'audio/mp3', 'Content-Disposition': 'attachment' });
            ffmpeg.stdout.pipe(res);
          } catch (error) {
            res.status(400).send("Error Occured");
          }
        }
        else {
          try {
            const vid_stream = ytdl(yturl, { quality: itag });
            const aud_stream = ytdl(yturl, { quality: "140" || "highestaudio" });
            const opath = `./tmp/output/${vid}.mp4`;
            const ffmpeg = spawn('ffmpeg', ['-an', '-i', 'pipe:4', '-vn', '-i', 'pipe:5', '-c:a', 'copy', '-c:v', 'copy', '-strict', '-2', '-f', 'mp4', `${opath}`], { stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'] });
            vid_stream.pipe(ffmpeg.stdio[4]);
            aud_stream.pipe(ffmpeg.stdio[5]);
            ffmpeg.on('exit', () => {
              res.set({ 'content-type': 'video/mp4' });
              res.download(path.join(__dirname, `../tmp/output/${vid}.mp4`), () => {
                fs.unlink(opath, () => { });
              })
            })
          } catch (error) {
            console.log(error);
            res.status(400).send('error occured');
          }

        }
      } catch (error) {
        console.log(error);
        res.status(400).send('invalid url');
      }
    } else {
      try {
        const yturl = req.body.url;
        console.log(yturl)
        const vid = ytdl.getURLVideoID(yturl);
        const info = await ytdl.getInfo(vid);
        let format = ytdl.chooseFormat(info.formats, { quality: "18" });
        res.status(200).send(format.url.toString());
      } catch (error) {
        res.status(400).send("Invalid URL");
      }
    }
  });
router
  .route("/instagram")
  .get((req, res) => {
    res.render("home", { path: "instagram" });
  })
  .post((req, res) => {
    try {
      axios
        .get(req.body.url, {
          headers: {
            cookie: process.env.INSTA_SESSION_COOKIE,
          },
        })
        .then(function (response) {
          const vid_info = response.data?.items?.[0]?.video_versions?.[0]?.url || response.data?.graphql?.shortcode_media?.video_url;
          res.send(vid_info);
        })
        .catch(function (e) {
          console.log(e)
          res.status(400).send("Invalid URL");
        });
    } catch (error) {
      console.log(error);
      res.status(400).send("Invalid URL");
    }
  });
router.route("/facebook")
  .get((req, res) => {
    res.render("home", { path: "facebook" });
  })
  .post((req, res) => {
    let uri;
    axios.get(req.body.url).then(function (response) {
      uri = response.request.res.responseUrl;
      uri = uri.replace('www', 'mbasic');
      axios.get(uri).then(function (fin_resp) {
        res.send(fin_resp.data);
      }).catch((er) => {
        res.status(400).send('erroroccured');
      })
    }).catch((err) => {
      res.status(400).send('error');
    });
  });
router
  .route("/instadp")
  .get((req, res) => {
    res.render("home", { path: "instadp" });
  })
  .post((req, res) => {
    try {
      axios
        .get(req.body.url, {
          headers: {
            cookie: process.env.INSTA_SESSION_COOKIE,
          },
        })
        .then(function (response) {
          const img_url = response.data.graphql.user.profile_pic_url_hd.toString();
          axios({
            method: "get",
            url: img_url,
            responseType: "stream",
          }).then(function (resp) {
            res.set('content-type', 'image/jpg');
            resp.data.pipe(res);
          }).catch(function (err) {
            console.log(err);
            res.status(400).send("Invalid URL");
          });
        })
        .catch(function (e) {
          console.log(e)
          res.status(400).send("Invalid URL");
        });
    } catch (error) {
      console.log(error);
      res.status(400).send("Invalid URL");
    }
  });
router.route("/format").post(async (req, res) => {
  try {
    const yturl = req.body.url;
    const vid = ytdl.getURLVideoID(yturl);
    const info = (await ytdl.getInfo(vid)).formats;
    let itag = [];
    for (let i = 0; i < info.length; i++) {
      if (info[i]?.itag === 135) {
        itag.push({ itag: 135, format: "480p MP4" });
      } else if (info[i]?.itag === 18) {
        itag.push({ itag: 18, format: "360p MP4" });
      } else if (info[i]?.itag === 136) {
        itag.push({ itag: 136, format: "720p MP4" });
      } else if (info[i]?.itag === 137) {
        itag.push({ itag: 137, format: "1080p MP4" });
      } else if (info[i]?.itag === 140) {
        itag.push({ itag: 140, format: "128kbps MP3" });
      }
    }
    res.status(200).send(itag);
  } catch (e) {
    res.status(400).send("Invalid URL");
  }
});
module.exports = router;
