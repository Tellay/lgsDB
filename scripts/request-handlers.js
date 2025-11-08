const express = require("express");
const mysql = require("mysql2");
const mysqlPool = require("../config/mysql-pool");
const bcrypt = require("bcrypt");
const options = require("../config/options.json");

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function signup(req, res) {
  let { full_name, email, password, password_confirmation } = req.body;

  if (typeof full_name === "string") {
    full_name = full_name.trim().replace(/\s+/g, " "); // remove extra spaces
  }

  if (typeof email === "string") {
    email = email.trim().replace(/\s+/g, " ").toLocaleLowerCase(); // removes spaces and standardizes the email
  }

  if (!full_name || !email || !password || !password_confirmation) {
    return res.status(400).json({
      message:
        "Missing fields. The required fields are full_name, email, password and password_confirmation.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format.",
    });
  }

  if (password.length < options.auth.min_password_length) {
    return res.status(400).json({
      message: `Password must be at least ${options.auth.min_password_length} characters long.`,
    });
  }

  if (password !== password_confirmation) {
    return res.status(400).json({
      message: "Passwords don't match.",
    });
  }

  mysqlPool.query(
    mysql.format("SELECT * FROM user WHERE email = ?", [email]),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error checking if email exists.",
        });
      } else if (rows.length) {
        return res.status(409).json({
          message: "Email already exists.",
        });
      } else {
        bcrypt.hash(password, options.auth.salt_rounds, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: "Error encrypting password.",
            });
          }

          mysqlPool.query(
            mysql.format(
              "INSERT INTO user (full_name, email, password) values (?, ?, ?)",
              [full_name, email, hash]
            ),
            (err, rows) => {
              if (err) {
                return res.status(500).json({
                  message: "Error signing up.",
                });
              }

              const user_id = rows.insertId;

              req.session.userId = user_id;
              req.session.userFullName = full_name;
              req.session.userEmail = email;

              mysqlPool.query(
                mysql.format("INSERT INTO access_log (user_id) values (?)", [
                  user_id,
                ]),
                (err, _) => {
                  if (err) {
                    return res.status(500).json({
                      message: "Error inserting access log.",
                    });
                  }

                  return res.status(201).json({
                    message: "Signed up successfully.",
                    user: {
                      id: user_id,
                      full_name,
                      email,
                    },
                  });
                }
              );
            }
          );
        });
      }
    }
  );
}
module.exports.signup = signup;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Missing fields. The required fields are email and password.",
    });
  }

  mysqlPool.query(
    mysql.format("SELECT * FROM user WHERE email = ?", [email]),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error getting user by email.",
        });
      }

      const user = rows[0];
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials.",
        });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({
            message: "Error comparing passwords.",
          });
        }

        if (!isMatch) {
          return res.status(401).json({
            message: "Invalid credentials.",
          });
        }

        req.session.userId = user.id;
        req.session.userFullName = user.full_name;
        req.session.userEmail = user.email;

        mysqlPool.query(
          mysql.format("INSERT INTO access_log (user_id) values (?)", [
            user.id,
          ]),
          (err, _) => {
            if (err) {
              return res.status(500).json({
                message: "Error inserting access log.",
              });
            }

            return res.json({
              message: "Logged in successfully.",
              user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
              },
            });
          }
        );
      });
    }
  );
}
module.exports.login = login;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Error logging out.",
      });
    }

    return res.json({
      message: "Logged out successfully.",
    });
  });
}
module.exports.logout = logout;

// ========================================================================= //

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function profile(req, res) {
  mysqlPool.query(
    mysql.format(
      "SELECT id, full_name, email, created_at FROM user WHERE id = ?",
      [req.session.userId]
    ),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error getting current user data.",
        });
      }

      return res.json({
        message: "Ok.",
        data: rows[0],
      });
    }
  );
}
module.exports.profile = profile;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function editProfile(req, res) {
  const { full_name, email } = req.body;

  if (typeof full_name === "string") {
    full_name = full_name.trim().replace(/\s+/g, " "); // remove extra spaces
  }

  if (typeof email === "string") {
    email = email.trim().replace(/\s+/g, " ").toLocaleLowerCase(); // removes spaces and standardizes the email
  }

  if (!full_name || !email) {
    return res.status(400).json({
      message: "Missing fields. The required fields are full_name and email.",
    });
  }

  // todo: think about create a reusable function to check if the email is valid, change in signup too
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format.",
    });
  }

  mysqlPool.query(
    mysql.format("SELECT COUNT(*) as count FROM user WHERE email = ?", [email]),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error checking email.",
        });
      }

      const exists = rows[0].count > 0;
      if (exists && email !== req.session.userEmail) {
        return res.status(409).json({
          message: "Email already in use.",
        });
      }

      const user_id = req.session.userId;
      mysqlPool.query(
        mysql.format("UPDATE user SET full_name = ?, email = ? WHERE id = ?", [
          full_name,
          email,
          user_id,
        ]),
        (err, rows) => {
          if (err) {
            return res.status(500).json({
              message: "Error updating profile.",
            });
          }

          const success = rows.affectedRows > 0;
          if (!success) {
            return res.status(404).json({
              message: "User not found.",
            });
          }

          req.session.userFullName = full_name;
          req.session.userEmail = email;

          return res.json({
            message: "Profile updated successfully.",
            user: {
              id: user_id,
              full_name,
              email,
            },
          });
        }
      );
    }
  );
}
module.exports.editProfile = editProfile;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function deleteProfile(req, res) {
  const user_id = req.session.userId;

  mysqlPool.query(
    mysql.format(`DELETE FROM user WHERE id = ?`, [user_id]),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error deleting user.",
        });
      }

      const success = rows.affectedRows > 0;
      if (!success) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            message: "Error logging out.",
          });
        }

        return res.json({
          message: "User deleted successfully.",
        });
      });
    }
  );
}
module.exports.deleteProfile = deleteProfile;

// ========================================================================= //

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function languages(req, res) {
  mysqlPool.query(
    `
      SELECT l.*, lf.name as family_name 
      FROM language l
      LEFT JOIN language_family lf ON l.language_family_id = lf.id
      ORDER BY l.name
    `,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error getting languages.",
        });
      }

      return res.json({
        message: "Ok.",
        data: rows,
      });
    }
  );
}
module.exports.languages = languages;

// ========================================================================= //

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function dashboardSummary(req, res) {
  mysqlPool.query(
    `
      SELECT 
      (SELECT COUNT(*) FROM language) as total_languages,
      (SELECT COUNT(*) FROM language_family) as total_language_families,
      (SELECT COUNT(*) FROM user) as total_users
    `,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching dashboard summary.",
        });
      }

      res.json({
        message: "Ok.",
        data: rows[0],
      });
    }
  );
}
module.exports.dashboardSummary = dashboardSummary;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function topPolyglots(req, res) {
  const limit = parseInt(req.query.limit) || 5;

  mysqlPool.query(
    mysql.format(
      `
      SELECT u.id, u.full_name, COUNT(ul.language_id) as language_count
      FROM user u
      LEFT JOIN user_language ul ON u.id = ul.user_id
      GROUP BY u.id, u.full_name
      ORDER BY language_count DESC
      LIMIT ?
    `,
      [limit]
    ),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching top polyglots.",
        });
      }

      return res.json({
        message: "Ok.",
        data: rows,
      });
    }
  );
}
module.exports.topPolyglots = topPolyglots;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function topLanguageFamilies(req, res) {
  const limit = parseInt(req.query.limit) || 5;

  mysqlPool.query(
    mysql.format(
      `
        SELECT 
        lf.id, 
        lf.name, 
        COUNT(l.id) as language_count,
        ROUND(
            (COUNT(l.id) * 100.0 / (SELECT COUNT(*) FROM language)),
            2
        ) as percentage
        FROM language_family lf
        LEFT JOIN language l ON lf.id = l.language_family_id
        GROUP BY lf.id, lf.name
        ORDER BY language_count DESC
        LIMIT ?
    `,
      [limit]
    ),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching top language families.",
        });
      }

      return res.json({
        message: "Ok.",
        data: rows,
      });
    }
  );
}
module.exports.topLanguageFamilies = topLanguageFamilies;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function topLanguages(req, res) {
  const limit = parseInt(req.query.limit) || 5;

  mysqlPool.query(
    mysql.format(
      `
        SELECT 
        l.id, 
        l.name, 
        COUNT(DISTINCT ul.user_id) as user_count,
        ROUND(
            (COUNT(DISTINCT ul.user_id) * 100.0 / (SELECT COUNT(*) FROM user)),
            1
        ) as percentage
        FROM language l
        LEFT JOIN user_language ul ON l.id = ul.language_id
        GROUP BY l.id, l.name
        HAVING user_count > 0
        ORDER BY user_count DESC
        LIMIT ?
      `,
      [limit]
    ),
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching top languages.",
        });
      }

      return res.json({
        message: "Ok.",
        data: rows,
      });
    }
  );
}
module.exports.topLanguages = topLanguages;

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function topUsersByAccess(req, res) {
  const limit = parseInt(req.query.limit) || 5;

  mysqlPool.query(
    mysql.format(
      `
        SELECT u.id, u.full_name, COUNT(al.id) as access_count
        FROM user u
        INNER JOIN access_log al ON u.id = al.user_id
        GROUP BY u.id, u.full_name
        ORDER BY access_count DESC
        LIMIT ?
      `,
      [limit]
    ),
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Error fetching top users by access.",
        });
      }

      return res.json({
        message: "Ok.",
        data: rows,
      });
    }
  );
}
module.exports.topUsersByAccess = topUsersByAccess;
