const express = require("express");
const router = express.Router();
const authenticationController = require("./controller");

router.post("/register", authenticationController.register);

module.exports = router;
