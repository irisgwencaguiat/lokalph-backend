const knex = require("../../../database/knex");

const keywordModel = {
  async createKeyword(input) {
    return await knex("keyword")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getKeywordDetails(id) {
    return await knex("keyword")
      .where("id", id)
      .then((result) => result[0]);
  },
};

module.exports = keywordModel;
