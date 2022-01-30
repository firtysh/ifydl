const express = require('express');
const ytdl = require("ytdl-core");
const router = express.Router();
router.route("/").post(async (req,res)=>{
  try {
  const yturl = req.body.url
  const vid= ytdl.getURLVideoID(yturl)
  const info = await ytdl.getInfo(vid);
  let format = ytdl.chooseFormat(info.formats, { quality: '18' });
  res.status(200).send(format.url.toString())
  } catch (error) {
    res.status(400).send('Invalid URL');
  }
})

router.route("/youtube").get((req, res) => {
  res.render("home", { path: "youtube" });
}).post();
router.route("/instagram").get((req, res) => {
  res.render("home", { path: "instagram" });
}).post();
router.route("/facebook").get((req, res) => {
  res.render("home", { path: "facebook" });
}).post();
router.route("/instadp").get((req, res) => {
  res.render("home", { path: "instadp" });
}).post();


module.exports = router