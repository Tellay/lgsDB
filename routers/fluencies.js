const express = require("express");
const router = express.Router();
const handler = require("../scripts/request-handlers");

router.get("/fluencies", handler.fluencies);

module.exports = router;
