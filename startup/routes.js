const express = require("express");
const bodyparser = require("body-parser");
const users = require("../routes/user");
const index = require("../routes/index");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

module.exports = function (app) {
  app.use(express.json());
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
  app.set("view engine", "ejs");
  app.use("/", index);
  app.use("/users", users);
};
