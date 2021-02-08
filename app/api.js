const express = require("express");
const api = express();
const knex = require("../database/knex");

api.get("/", async (request, response) => {
  const { name, email } = request.body;
  const payload = {
    name,
    email,
  };
  const result = await knex("test").insert(payload);
  response.json(result);
});

module.exports = api;
