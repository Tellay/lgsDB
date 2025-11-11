"use strict";

const mysql = require("mysql2");
const options = require("./options.json");

const pool = mysql.createPool(options.database);

module.exports = pool;
