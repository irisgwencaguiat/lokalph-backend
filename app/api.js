const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const shopRouter = require("./components/shop/router");
const middleware = require("./middleware");

api.use("/authentication", authenticationRouter);
api.use("/shop", shopRouter);
// api.post(
//   "/test",
//   [
//     middleware.authentication.passportAuthenticate,
//     middleware.authentication.grantAccess(["customer", "seller", "admin"]),
//   ],
//   (request, response) => {
//     response.status(200).json(request.body);
//   }
// );

module.exports = api;
