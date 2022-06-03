const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const { User, validateUser, validateRegistration } = require("../models/user");

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login", {
    success: req.flash("success_msg"),
    error: req.flash("error"),
    error_msg: req.flash("error_msg"),
  });
});

router.post("/register", async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.render("register", { error: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  // res.send(user);

  if (user) {
    req.flash("error", "User already exists");
    res.redirect("/users/login");
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  console.log(user);

  await user
    .save()
    .then((user) => {
      req.flash("success_msg", "You are now registered and can log in");
      res.redirect("/users/login");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/users/login",
//     failureFlash: true,
//   })(req, res, next);
// });

// await User.findOne({ email: req.body.email })
//   .then(async (user) => {
//     if (!user) {
//       req.flash("error_msg", "Invalid email or password");
//       res.redirect("/users/login");
//     }
//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!validPassword) {
//       req.flash("error_msg", "Invalid email or password");
//       res.redirect("/users/login");
//     }
//     res.render("dashboard", { user: user });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // if (!user) {
// // req.flash("error", "User already exists");
// // res.redirect("/users/login");
// // }

// // const validPassword = await bcrypt.compare(req.body.password, user.password);
// // if (!validPassword) {
// //   res.send("Invalid Email or Password.");
// // }
// // res.send("success");
// });

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
