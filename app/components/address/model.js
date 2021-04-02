const knex = require("../../../database/knex");

const addressModel = {
  tableName: "address",

  async createAddress(address) {
    return await knex(addressModel.tableName)
      .insert({ ...address })
      .returning(["id"])
      .then((result) => {
        return result[0];
      });
  },
  async getAddressDetails(id) {
    return await knex("address")
      .where("id", id)
      .then(async (result) => {
        return result[0];
      });
  },
};

module.exports = addressModel;
