require("dotenv").config();
const express = require("express");
const downloadRouter = require("./routes/download");
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", { path: "home" });
});
app.use("/download", downloadRouter);
app.get("/about", (req, res) => {
  res.render("home", { path: "about" });
});
app.get("*", (req, res) => {
  res.send("error page");
});

app.listen(port, () => {
  console.log("listening on port " + port);
});

