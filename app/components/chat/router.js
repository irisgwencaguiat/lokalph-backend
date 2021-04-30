const express = require("express");
const router = express.Router();
const chatController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/room",
  [
    middleware.multer().single("image"),
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller"]),
  ],
  chatController.createChatRoom
);

router.get(
  "/rooms/shop/:shop_id",
  [
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["seller"]),
  ],
  chatController.getShopRooms
);

module.exports = router;
