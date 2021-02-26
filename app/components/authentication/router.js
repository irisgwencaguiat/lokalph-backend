const express = require("express");
const router = express.Router();
const authenticationController = require("./controller");
const middleware = require("../../middleware");

router.post("/register", authenticationController.register);
router.post("/log-in", authenticationController.logIn);
router.get(
  "/validate-user",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller", "admin"]),
  ],
  authenticationController.validateUser
);
module.exports = router;
