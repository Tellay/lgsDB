const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");
const { requireAuth } = require("../middlewares/auth");

router.get("/profile", requireAuth, handler.profile);
router.put("/profile", requireAuth, handler.editProfile);
router.delete("/profile", requireAuth, handler.deleteProfile);
router.get("/profile/ranking", requireAuth, handler.profileRanking);
router.get("/profile/accesses", requireAuth, handler.profileAccesses);
router.get("/profile/languages", requireAuth, handler.profileLanguages);

module.exports = router;
