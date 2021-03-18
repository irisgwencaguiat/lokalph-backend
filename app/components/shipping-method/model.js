const knex = require("../../../database/knex");

const shippingMethodModel = {
  async getShippingMethodDetails(id) {
    return await knex("shipping_method")
      .where("id", id)
      .then((result) => result[0]);
  },
};

module.exports = shippingMethodModel;
