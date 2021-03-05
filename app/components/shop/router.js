const express = require("express");
const router = express.Router();
const shopController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller", "admin"]),
  ],
  shopController.createShop
);

router.get("/account/:account_id", shopController.getAccountShops);

module.exports = router;
