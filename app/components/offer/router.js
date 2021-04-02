const express = require("express");
const router = express.Router();
const offerController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller", "admin"]),
  ],
  offerController.createOffer
);

router.get(
  "/shop/:shop_id/:date_from/:date_to",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["seller"]),
  ],
  offerController.getShopOffers
);

router.put(
  "/cancel",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller", "admin"]),
  ],
  offerController.cancelOffer
);
router.put(
  "/accept",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["seller"]),
  ],
  offerController.acceptOffer
);

module.exports = router;
