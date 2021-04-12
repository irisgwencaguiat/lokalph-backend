const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");

const reviewModel = {
  async createProductReview(input) {
    return await knex("product_review")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async createShopReview(input) {
    return await knex("shop_review")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async createProductReviewImage(input) {
    return await knex("product_review_image")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getProductReviewById(id) {
    return await knex("product_review")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getProductReviewImage(id) {
    const productReviewImagesDetails = await knex("product_review_image")
      .where("product_review_id", id)
      .then((result) => result);
    return await Promise.all(
      productReviewImagesDetails.map(async (image) => {
        return await knex("image")
          .where("id", image.image_id)
          .then((result) => result[0]);
      })
    );
  },
  async getShopReviewById(id) {
    return await knex("shop_review")
      .where("id", id)
      .then((result) => result[0]);
  },
};

module.exports = reviewModel;
