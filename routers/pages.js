const express = require("express");
const router = express.Router();
const path = require("path");
const {
  redirectIfAuthenticated,
  redirectIfNotAuthenticated,
} = require("../middlewares/auth");

router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "login.html"));
});

router.get("/signup", redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "signup.html"));
});

router.get("/stats", redirectIfNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "stats.html"));
});

module.exports = router;
