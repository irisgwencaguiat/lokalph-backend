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

module.exports = router;
