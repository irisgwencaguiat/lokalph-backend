const express = require("express");
const router = express.Router();
const reviewController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  [
    middleware.multer().array("images"),
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller"]),
  ],
  reviewController.createReview
);

module.exports = router;
