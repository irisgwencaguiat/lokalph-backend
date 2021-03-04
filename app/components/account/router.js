const express = require("express");
const accountRouter = express.Router();
const accountController = require("./controller");

accountRouter.get("/email/:email", accountController.getDetailsByEmail);

module.exports = accountRouter;
