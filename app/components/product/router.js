const express = require("express");
const router = express.Router();
const productController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  [
    middleware.multer().array("images"),
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["seller", "admin"]),
  ],
  productController.createProduct
);
router.post(
  "/inquiry",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller", "admin"]),
  ],
  productController.createProductInquiry
);

router.get("/shop/:shop_id", productController.getShopProducts);
router.get("/categories", productController.getProductCategories);
router.get("/conditions", productController.getProductConditions);
router.get("/shipping-methods", productController.getProductShippingMethods);
router.get("/:slug", productController.getProductDetailsBySlug);

module.exports = router;
