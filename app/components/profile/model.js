const knex = require("../../../database/knex");

const profileModel = {
  tableName: "profile",

  async register({ first_name, last_name, birth_date, introduction }) {
    return await knex(profileModel.tableName)
      .insert({
        first_name,
        last_name,
        birth_date,
        introduction,
      })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getProfileByFirstName(name) {
    return await knex(profileModel.tableName)
      .where("first_name", "ilike", `%${name}%`)
      .then((result) => result || []);
  },
  async getProfileByLastName(name) {
    return await knex(profileModel.tableName)
      .where("last_name", "ilike", `%${name}%`)
      .then((result) => result || []);
  },
};

module.exports = profileModel;
