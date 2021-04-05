const express = require("express");
const router = express.Router();
const transactionController = require("./controller");
const middleware = require("../../middleware");

router.get(
  "/shop/:shop_id",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["seller"]),
  ],
  transactionController.getShopTransactions
);

router.get(
  "/account",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller"]),
  ],
  transactionController.getAccountTransactions
);

module.exports = router;
