const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const shopRouter = require("./components/shop/router");
const accountRouter = require("./components/account/router");
const productRouter = require("./components/product/router");
const offerRouter = require("./components/offer/router");
const transactionRouter = require("./components/transaction/router");
const reviewRouter = require("./components/review/router");

api.use("/authentication", authenticationRouter);
api.use("/shop", shopRouter);
api.use("/account", accountRouter);
api.use("/product", productRouter);
api.use("/offer", offerRouter);
api.use("/transaction", transactionRouter);
api.use("/review", reviewRouter);

module.exports = api;
