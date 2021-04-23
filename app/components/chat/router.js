const express = require("express");
const router = express.Router();
const chatController = require("./controller");
const middleware = require("../../middleware");

router.post("/", [
  [
    middleware.multer().single("image"),
    middleware.authentication.passportAuthenticate,
    middleware.authentication.grantAccess(["customer", "seller"]),
  ],
  chatController.createChatRoom,
]);

module.exports = router;
