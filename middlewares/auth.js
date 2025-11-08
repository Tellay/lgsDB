const express = require("express");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  next();
}
module.exports.requireAuth = requireAuth;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function requireGuest(req, res, next) {
  if (req.session && req.session.userId) {
    return res.status(403).json({ message: "Already logged in." });
  }

  next();
}
module.exports.requireGuest = requireGuest;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function redirectIfAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return res.redirect("/dashboard");

  next();
}
module.exports.redirectIfAuthenticated = redirectIfAuthenticated;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
function redirectIfNotAuthenticated(req, res, next) {
  if (!req.session || !req.session.userId) return res.redirect("/login");

  next();
}
module.exports.redirectIfNotAuthenticated = redirectIfNotAuthenticated;
