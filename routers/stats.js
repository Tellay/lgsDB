const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");
const { requireAuth } = require("../middlewares/auth");

router.get("/dashboard-summary", requireAuth, handler.dashboardSummary);
router.get("/top-polyglots", handler.topPolyglots);
router.get("/top-language-families", handler.topLanguageFamilies);
router.get("/top-languages", handler.topLanguages);
router.get("/top-users-access", handler.topUsersByAccess);

module.exports = router;
