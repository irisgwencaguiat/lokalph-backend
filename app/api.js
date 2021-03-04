const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const shopRouter = require("./components/shop/router");
const accountRouter = require("./components/account/router");

api.use("/authentication", authenticationRouter);
api.use("/shop", shopRouter);
api.use("/account", accountRouter);

module.exports = api;
