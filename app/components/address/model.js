const knex = require("../../../database/knex");

const addressModel = {
  tableName: "address",
  createAddress: async (address) => {
    return await knex(addressModel.tableName)
      .insert({ ...address })
      .returning(["id"])
      .then((result) => {
        return result[0];
      });
  },
};

module.exports = addressModel;
