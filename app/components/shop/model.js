const knex = require("../../../database/knex");
const accountModel = require("../account/model");

const shopModel = {
  tableName: "shop",

  async createShop(input) {
    return await knex(shopModel.tableName)
      .insert({ ...input })
      .returning(["id", "address_id", "account_id"])
      .then((result) => result[0]);
  },

  async getShopDetailsBySlug(slug) {
    return await knex("shop")
      .where("slug", slug)
      .then(async (result) => {
        if (result.length === 0) return null;
        const id = result[0].id;
        return await shopModel.getShopDetails(id);
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
        delete shop.account.stripe_id;
        delete shop.account.profile_id;
        delete shop.account.account_type_id;
        delete shop.account.address_id;
        delete shop.account.stripe;
        return shop;
      });
  },

  async getAccountShops({ accountId, page, perPage, sort }) {
    return knex(shopModel.tableName)
      .where("account_id", accountId)
      .orderBy("created_at", sort)
      .paginate({
        perPage: perPage,
        currentPage: page,
      })
      .then(async (result) => {
        const data = result.data;
        const shops = await Promise.all(
          data.map(async (item) => await shopModel.getShopDetails(item.id))
        );
        const totalCount = await shopModel.getAccountShopsTotalCount(accountId);
        return {
          shops,
          total_count: totalCount,
        };
      });
  },

  async searchAccountShops({ accountId, page, perPage, sort, search }) {
    return await knex(shopModel.tableName)
      .join("address", "shop.address_id", "=", "address.id")
      .select(["shop.id as id"])
      .where("shop.account_id", accountId)
      .andWhere("shop.name", "ilike", `%${search}%`)
      .orWhere("shop.contact_number", "ilike", `%${search}%`)
      .orWhere("address.value", "ilike", `%${search}%`)
      .orderBy("created_at", sort)
      .paginate({
        perPage: perPage,
        currentPage: page,
      })
      .then(async (result) => {
        const data = result.data;
        const shops = await Promise.all(
          data.map(async (item) => await shopModel.getShopDetails(item.id))
        );
        const totalCount = await shopModel.getAccountShopsTotalCount(accountId);
        return {
          shops,
          total_count: totalCount,
        };
      });
  },

  async getAccountShopsTotalCount(accountId) {
    return knex(shopModel.tableName)
      .count("id")
      .where("account_id", accountId)
      .then((result) => parseInt(result[0].count) || null);
  },
};

module.exports = shopModel;
