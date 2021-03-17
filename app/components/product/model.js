const knex = require("../../../database/knex");
const imageModel = require("../image/model");

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
  async createProductImage(input) {
    return await knex("product_image")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getProductDetails(id) {
    return await knex(productModel.tableName)
      .where("id", id)
      .then(async (result) => {
        const product = result[0];
        const productImagesDetails = await knex("product_image")
          .where("product_id", product.id)
          .then((result2) => result2);
        const images = await Promise.all(
          productImagesDetails.map(async (image) => {
            return await imageModel.getImageDetails(image.image_id);
          })
        );
        product.images = Object.assign([], images);
        return product;
      });
  },
};

module.exports = productModel;
