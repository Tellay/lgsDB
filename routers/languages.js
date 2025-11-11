const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");
const { requireAuth } = require("../middlewares/auth");

router.get("/languages", handler.languages);
router.get("/languages/:id", handler.language);
router.post("/languages", requireAuth, handler.addLanguage);
router.put("/languages/:id", requireAuth, handler.editLanguage);
router.delete("/languages/:id", requireAuth, handler.deleteLanguage);

module.exports = router;
