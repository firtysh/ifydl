const express = require("express");
const ytdl = require("ytdl-core");
const axios = require("axios");
const router = express.Router();
router
  .route("/youtube")
  .get((req, res) => {
    res.render("home", { path: "youtube" });
  })
  .post(async (req, res) => {
    try {
      const yturl = req.body.url;
      const vid = ytdl.getURLVideoID(yturl);
      const info = await ytdl.getInfo(vid);
      let format = ytdl.chooseFormat(info.formats, { quality: "18" });
      res.status(200).send(format.url.toString());
    } catch (error) {
      res.status(400).send("Invalid URL");
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
          const vid_info =response.data.items[0].video_versions;
          res.send(vid_info);
        })
        .catch(function () {
          res.status(400).send("Invalid URL");
        });
    } catch (error) {
      res.status(400).send("Invalid URL");
    }
  });
router.route("/facebook").get((req, res) => {
  res.render("home", { path: "facebook" });
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
          console.log(img_url);
          axios({
            method: "get",
            url: img_url,
            responseType: "stream",
          }).then(function (resp) {
            resp.data.pipe(res);
          }).catch(function(){
            res.status(400).send("Invalid URL");
          });
        })
        .catch(function (e) {
          console.log(e);
          res.status(400).send("Invalid URL");
        });
    } catch (error) {
      res.status(400).send("Invalid URL");
    }
  });
router.route("/format").post(async (req, res) => {
  try {
    const yturl = req.body.url;
    console.log(yturl);
    const vid = ytdl.getURLVideoID(yturl);
    const info = (await ytdl.getInfo(vid)).formats;
    let itag = [];
    for (let i = 0; i < info.length; i++) {
      if (info[i]?.itag === 135) {
        itag.push({ itag: 135, format: "480p MP4" });
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
    console.log(e);
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
