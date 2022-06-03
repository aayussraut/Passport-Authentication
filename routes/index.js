const express = require("express");
const router = require("./user");
const app = express.Router();

const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require("../middleware/auth");
const { route } = require("./user");

router.get("/", forwardAuthenticated, (req, res) => {
  res.render("welcome");
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});
module.exports = router;
