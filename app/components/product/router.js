const express = require("express");
const router = express.Router();
const productController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["seller", "admin"]),
  ],
  productController.createProduct
);

module.exports = router;
