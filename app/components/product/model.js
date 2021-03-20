const knex = require("../../../database/knex");
const shopModel = require("../shop/model");
const imageModel = require("../image/model");
const shippingMethodModel = require("../shipping-method/model");
const keywordModel = require("../keyword/model");

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
  async getProductConditions() {
    return await knex("product_condition").then((result) => result);
  },

  async createProductShippingMethod(input) {
    return await knex("product_shipping_method")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async createProductKeyword(input) {
    return await knex("product_keyword")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
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
        const productCategory = await knex("product_category")
          .where("id", product.product_category_id)
          .then((result2) => result2[0]);
        const productCondition = await knex("product_condition")
          .where("id", product.product_condition_id)
          .then((result2) => result2[0]);
        const productImagesDetails = await knex("product_image")
          .where("product_id", product.id)
          .then((result2) => result2);
        const images = await Promise.all(
          productImagesDetails.map(async (image) => {
            return await imageModel.getImageDetails(image.image_id);
          })
        );
        const productKeywordsDetails = await knex("product_keyword")
          .where("product_id", product.id)
          .then((result2) => result2);
        const keywords = await Promise.all(
          productKeywordsDetails.map(async (keyword) => {
            return await keywordModel.getKeywordDetails(keyword.keyword_id);
          })
        );
        const productShippingMethodsDetails = await knex(
          "product_shipping_method"
        )
          .where("product_id", product.id)
          .then((result2) => result2);
        const shippingMethods = await Promise.all(
          productShippingMethodsDetails.map(async (method) => {
            return await shippingMethodModel.getShippingMethodDetails(
              method.shipping_method_id
            );
          })
        );
        const shop = await shopModel.getShopDetails(product.shop_id);
        product.shop = Object.assign({}, shop);
        product.category = Object.assign({}, productCategory);
        product.condition = Object.assign({}, productCondition);
        product.images = Object.assign([], images);
        product.shipping_methods = Object.assign([], shippingMethods);
        product.keywords = Object.assign([], keywords);
        delete product.shop_id;
        delete product.product_category_id;
        delete product.product_condition_id;
        return product;
      });
  },
  async getProductsByShop({ shopId, search, page, perPage }) {
    return await knex("product")
      .where("shop_id", shopId)
      .paginate({
        perPage,
        currentPage: page,
      })
      .then((result) => result);
  },
};

module.exports = productModel;
