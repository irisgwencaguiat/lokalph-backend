const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const passport = require("passport");
const middleware = require("./middleware");

api.use("/authentication", authenticationRouter);

api.post(
  "/test",
  [
    passport.authenticate("jwt", { session: false }),
    middleware.authentication.grantAccess(["admin"]),
  ],
  (request, response) => {
    console.log(request.body);
  }
);

module.exports = api;
