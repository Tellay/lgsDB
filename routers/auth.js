const express = require("express");
const router = express.Router();
const handlers = require("../scripts/request-handlers");
const { requireGuest, requireAuth } = require("../middlewares/auth");

router.post("/signup", requireGuest, handlers.signup);
router.post("/login", requireGuest, handlers.login);
router.post("/logout", requireAuth, handlers.logout);

module.exports = router;
