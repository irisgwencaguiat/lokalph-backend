const knex = require("../../../database/knex");

const stripeModel = {
  tableName: "stripe",
  createStripe: async (stripe) => {
    return await knex(stripeModel.tableName)
      .insert({ ...stripe })
      .returning(["id"])
      .then((result) => {
        return result[0];
      });
  },
};

module.exports = stripeModel;
