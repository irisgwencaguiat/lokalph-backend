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
router.post(
  "/inquiry/reply",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["seller", "admin"]),
  ],
  productController.createProductInquiryReply
);
router.post(
  "/view",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller", "admin"]),
  ],
  productController.createProductView
);
router.post(
  "/like",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller", "admin"]),
  ],
  productController.createProductLike
);

router.get("/shop/:shop_id", productController.getShopProducts);
router.get("/categories", productController.getProductCategories);
router.get("/conditions", productController.getProductConditions);
router.get("/shipping-methods", productController.getProductShippingMethods);
router.get(
  "/shop/:shop_id/:product_slug",
  productController.getProductDetailsBySlug
);
router.get("/inquiries/:product_id", productController.getProductInquiries);
router.get(
  "/inquiry/reply/:product_inquiry_id",
  productController.getProductInquiryReply
);
router.get("/views/:product_id", productController.getProductViews);
module.exports = router;
