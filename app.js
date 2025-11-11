const express = require("express");
const session = require("express-session");
const options = require("./config/options.json");
const PORT = options.server.port || 8081;
const path = require("path");
const authRouter = require("./routers/auth");
const languagesRouter = require("./routers/languages");
const languageFamilies = require("./routers/families");
const fluenciesRouter = require("./routers/fluencies");
const profileRouter = require("./routers/profile");
const statsRouter = require("./routers/stats");
const pagesRouter = require("./routers/pages");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "www", "public")));
app.use(
  session({
    secret: options.session.secret,
    resave: false,
    saveUninitialized: false,
    rolling: true, // renews maxAge on each request
    cookie: {
      httpOnly: true,
      secure: options.server.environment !== "DEVELOPMENT" ? true : false,
      maxAge: 1000 * 60 * 60 * 2, // 2h
    },
  }) // todo: try to keep session alive when the server restarts
);

app.use("/", authRouter);
app.use("/", languagesRouter);
app.use("/", languageFamilies);
app.use("/", fluenciesRouter);
app.use("/", profileRouter);
app.use("/", statsRouter);
app.use("/", pagesRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server: ", err);
    process.exit(1);
  }

  console.log(`Server running at http://localhost:${PORT}`);
});
