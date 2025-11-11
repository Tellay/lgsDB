const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");

router.get("/languages", handler.languages);
router.get("/languages/:id", handler.language);

module.exports = router;
