const express = require("express");
const app = express();
const passport = require("passport");
const mongoose = require("mongoose");

require("./middleware/passport")(passport);
require("./startup/routes")(app);
require("./startup/db")();
app.listen(8080, () => {
  console.log("Server Listening to port 8080");
});
