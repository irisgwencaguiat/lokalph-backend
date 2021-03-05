const express = require("express");
const router = express.Router();
const productController = require("./controller");

router.post("/shop", productController.createProduct);

module.exports = router;
