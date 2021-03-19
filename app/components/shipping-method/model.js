const knex = require("../../../database/knex");

const shippingMethodModel = {
  async getShippingMethodDetails(id) {
    return await knex("shipping_method")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getShippingMethods() {
    return await knex("shipping_method").then((result) => result);
  },
};

module.exports = shippingMethodModel;
