const express = require("express");
const router = express.Router();
const authenticationController = require("./controller");
const passport = require("passport");

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   accountController.authentication
// );

router.post("/register", authenticationController.register);

module.exports = router;
