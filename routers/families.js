const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");

router.get("/families", handler.languageFamilies);

module.exports = router;
