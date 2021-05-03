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
        const productCount = await shopModel.getShopProductsTotalCount(shop.id);
        const orderCount = await shopModel.getShopOrdersTotalCount(shop.id);
        const ratings = (await shopModel.getShopRatings(shop.id)) || [];
        const ratingNumbers = await Promise.all(
          ratings.map((data) => data.rating)
        );
        const ratingCount = await shopModel.getShopRatingsTotalCount(shop.id);
        let ratingSum = 0;
        if (ratingNumbers.length > 0) {
          ratingSum = await ratingNumbers.reduce((a, b) => {
            return a + b;
          });
        }
        const ratingAverage =
          (await parseInt(ratingSum)) / parseInt(ratingCount);
        shop.account = Object.assign({}, account);
        shop.address = Object.assign({}, address);
        shop.total_products_count = productCount;
        shop.total_orders_count = orderCount;
        shop.rating = ratingAverage || 0;
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
      .orderBy("shop.created_at", sort)
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
  async getShopProductsTotalCount(shopId) {
    return await knex("product")
      .count("id")
      .where("shop_id", shopId)
      .then((result) => parseInt(result[0].count));
  },
  async getShopOrdersTotalCount(shopId) {
    return await knex("transaction")
      .count("id")
      .where("shop_id", shopId)
      .andWhere("status", "received")
      .then((result) => parseInt(result[0].count));
  },
  async getShopRatings(shopId) {
    return await knex("shop_review")
      .where("shop_id", shopId)
      .then((result) => result);
  },
  async getShopRatingsTotalCount(shopId) {
    return await knex("shop_review")
      .count("id")
      .where("shop_id", shopId)
      .then((result) => parseInt(result[0].count));
  },
  async searchShop({ page, perPage, sort, search }) {
    return await knex("shop")
      .whereRaw("to_tsvector(name) @@ to_tsquery(?)", [search])
      .orderBy("created_at", sort)
      .paginate({
        perPage,
        currentPage: page,
      })
      .then((result) => result.data);
  },
  async searchShopTotalCount({ search }) {
    return await knex("shop")
      .count("id")
      .whereRaw("to_tsvector(name) @@ to_tsquery(?)", [search])
      .then((result) => parseInt(result[0].count));
  },
};

module.exports = shopModel;
