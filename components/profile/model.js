const knex = require("../../database/knex");

const profileModel = {
  tableName: "profile",

  register: async ({ first_name, last_name, birth_date, introduction }) => {
    return await knex(profileModel.tableName)
      .insert({
        first_name,
        last_name,
        birth_date,
        introduction,
      })
      .returning(["id"])
      .then((result) => {
        return result[0];
      });
  },
};

module.exports = profileModel;
