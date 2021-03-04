const knex = require("../../../database/knex");

const stripeModel = {
  tableName: "stripe",
  async createStripe({ publishableKey, secretKey }) {
    return await knex(stripeModel.tableName)
      .insert({
        publishable_key: publishableKey,
        secret_key: secretKey,
      })
      .returning(["id"])
      .then((result) => {
        return result[0];
      });
  },
};

module.exports = stripeModel;
