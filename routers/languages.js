const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");

router.get("/languages", handler.languages);

module.exports = router;
