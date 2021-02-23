const express = require("express");
const api = express();
const knex = require("../database/knex");
const authenticationRouter = require("../components/authentication/router");

api.use("/authentication", authenticationRouter);

module.exports = api;
