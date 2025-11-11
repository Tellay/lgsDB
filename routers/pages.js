const express = require("express");
const router = express.Router();
const path = require("path");
const {
  redirectIfAuthenticated,
  redirectIfNotAuthenticated,
} = require("../middlewares/auth");

// if the user is already logged in, redirect to /dashboard, otherwise redirect to /login
router.get("/", redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "index.html"));
});

router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "login.html"));
});

router.get("/signup", redirectIfAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "signup.html"));
});

router.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "stats.html"));
});

router.get("/dashboard", redirectIfNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "dashboard.html"));
});

router.get("/langs", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "langs.html"));
});

router.get("/langs/add", redirectIfNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "lang-form.html"));
});

router.get("/langs/edit/:id", redirectIfNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "lang-form.html"));
});

router.get("/langs/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "www", "pages", "lang.html"));
});

module.exports = router;
