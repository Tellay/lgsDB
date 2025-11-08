const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");
const { requireAuth } = require("../middlewares/auth");

router.get("/profile", requireAuth, handler.profile);
router.put("/profile", requireAuth, handler.editProfile);
router.delete("/profile", requireAuth, handler.deleteProfile);

module.exports = router;
