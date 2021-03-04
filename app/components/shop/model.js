const knex = require("../../../database/knex");
const accountModel = require("../account/model");

const shopModel = {
  tableName: "shop",

  async createShop(input) {
    return await knex(shopModel.tableName)
      .insert({ ...input })
      .returning(["id", "address_id", "account_id"])
      .then((result) => {
        return result[0];
      });
  },

  async getShopDetailsByName(name) {
    return await knex(shopModel.tableName)
      .where("name", name)
      .then((result) => {
        return result[0];
      });
  },

  async getShopDetails(id) {
    return await knex(shopModel.tableName)
      .where("id", id)
      .then(async (result) => {
        const shop = result[0];
        const account = await accountModel.getDetails(shop.account_id);
        const address = await knex("address")
          .where("id", shop.address_id)
          .then(async (result) => {
            return result[0];
          });
        shop.account = Object.assign({}, account);
        shop.address = Object.assign({}, address);
        delete shop.account_id;
        delete shop.address_id;
        delete shop.account.profile_id;
        delete shop.account.account_type_id;
        delete shop.account.address_id;

        return shop;
      });
  },
};

module.exports = shopModel;
