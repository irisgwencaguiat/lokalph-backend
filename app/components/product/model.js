const knex = require("../../../database/knex");

const productModel = {
  tableName: "product",

  async createProduct(input) {
    return await knex(productModel.tableName)
      .insert({ ...input })
      .returning(["id", "shop_id", "product_category_id"])
      .then((result) => result[0]);
  },

  async doesProductExist(shopId, slug) {
    return await knex(productModel.tableName)
      .where("shop_id", shopId)
      .andWhere("slug", slug)
      .then((result) => result.length > 0);
  },

  async getProductCategories() {
    return await knex("product_category").then((result) => result);
  },
};

module.exports = productModel;
