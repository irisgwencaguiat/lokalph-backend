const knex = require("../../../database/knex");

const imageModel = {
  async createImage(input) {
    return await knex("image")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getImageDetails(id) {
    return await knex("image")
      .where("id", id)
      .then((result) => result[0]);
  },
};

module.exports = imageModel;
