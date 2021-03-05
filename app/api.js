const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const shopRouter = require("./components/shop/router");
const accountRouter = require("./components/account/router");
const productRouter = require("./components/product/router");

api.use("/authentication", authenticationRouter);
api.use("/shop", shopRouter);
api.use("/account", accountRouter);
api.use("/product", productRouter);

module.exports = api;
