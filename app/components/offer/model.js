const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");

const offerModel = {
  async createOffer(input) {
    return await knex("offer")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getOfferDetailsById(id) {
    return await knex("offer")
      .where("id", id)
      .then(async (result) => {
        const offer = result[0];
        const product = await offerModel.getOfferProductDetails(
          offer.product_id
        );
        const shop = await offerModel.getOfferShopDetails(offer.shop_id);
        const account = await offerModel.getOfferAccountDetails(
          offer.account_id
        );
        const shippingMethod = await offerModel.getOfferProductShippingMethod(
          offer.shipping_method_id
        );
        offer.cancelled_by =
          (await offerModel.getOfferAccountDetails(offer.cancelled_by)) || null;
        offer.product = Object.assign({}, product);
        offer.shop = Object.assign({}, shop);
        offer.account = Object.assign({}, account);
        offer.shipping_method = Object.assign({}, shippingMethod);
        delete offer.product_id;
        delete offer.shop_id;
        delete offer.account_id;
        delete offer.shipping_method_id;
        return offer;
      });
  },
  async getOfferProductShippingMethod(id) {
    return await knex("shipping_method")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getOfferProductDetails(id) {
    return await knex("product")
      .where("id", id)
      .then(async (result) => {
        const product = result[0];
        const productCategory = await offerModel.getOfferProductCategoryDetails(
          product.product_category_id
        );
        const productCondition = await offerModel.getOfferProductConditionDetails(
          product.product_condition_id
        );

        const images = await offerModel.getOfferProductImagesDetails(
          product.id
        );

        const keywords = await offerModel.getOfferProductKeywordsDetails(
          product.id
        );

        const shippingMethods = await offerModel.getOfferProductShippingMethodsDetails(
          product.id
        );
        const shop = await offerModel.getOfferShopDetails(product.shop_id);
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
  async getOfferProductCategoryDetails(id) {
    return await knex("product_category")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getOfferProductConditionDetails(id) {
    return await knex("product_condition")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getOfferProductImagesDetails(id) {
    const productImagesDetails = await knex("product_image")
      .where("product_id", id)
      .then((result) => result);
    return await Promise.all(
      productImagesDetails.map(async (image) => {
        return await knex("image")
          .where("id", image.image_id)
          .then((result) => result[0]);
      })
    );
  },
  async getOfferKeywordDetails(id) {
    return await knex("keyword")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getOfferProductKeywordsDetails(id) {
    const productKeywordsDetails = await knex("product_keyword")
      .where("product_id", id)
      .then((result) => result);
    return await Promise.all(
      productKeywordsDetails.map(async (keyword) => {
        return await offerModel.getOfferKeywordDetails(keyword.keyword_id);
      })
    );
  },
  async getOfferShopDetails(id) {
    return await knex("shop")
      .where("id", id)
      .then(async (result) => {
        const shop = result[0];
        const account = await offerModel.getOfferAccountDetails(
          shop.account_id
        );
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
  async getOfferAccountDetails(id) {
    return (
      (await knex(`account`)
        .where("id", id)
        .then(async (result) => {
          if (!result[0]) return null;
          const account = result[0];
          const profile = await knex("profile")
            .where("profile.id", account.profile_id)
            .then((result2) => result2[0]);
          const account_type = await knex("account_type")
            .where("account_type.id", account.account_type_id)
            .then((result2) => result2[0]);
          const stripe =
            (await knex("stripe")
              .where("stripe.id", account.stripe_id)
              .then((result2) => result2[0])) || null;
          account.profile = Object.assign({}, profile);
          account.account_type = Object.assign({}, account_type);
          account.stripe = stripe ? Object.assign({}, stripe) : null;
          delete account.password;
          return account;
        })) || null
    );
  },
  async getOfferProductShippingMethodsDetails(id) {
    const productShippingMethodsDetails = await knex("product_shipping_method")
      .where("product_id", id)
      .then((result) => result);
    return await Promise.all(
      productShippingMethodsDetails.map(async (method) => {
        return await offerModel.getOfferProductShippingMethod(
          method.shipping_method_id
        );
      })
    );
  },
  async getShopOffers({ shop_id, date_from, date_to, page, perPage }) {
    const shopOffers = await knex("offer")
      .where("shop_id", shop_id)
      // .andWhere((qb) =>
      //   qb
      //     .where("created_at", ">=", `${date_from}:00:00:00`)
      //     .andWhere("created_at", "<=", `${date_to}:23:59:59`)
      // )
      // .orWhere((qb) =>
      //   qb
      //     .where("created_at", "=", date_from)
      //     .andWhere("created_at", "=", date_to)
      // )
      .andWhere("created_at", ">=", `${date_from}:00:00:00`)
      .andWhere("created_at", "<=", `${date_to}:23:59:59`)
      .orderBy("created_at", "desc")
      .paginate({
        perPage,
        currentPage: page,
      })
      .then(async (result) => {
        if (result.data.length < 1) return [];
        return await Promise.all(
          result.data.map(async (data) => {
            const offer = data;
            const product = await offerModel.getOfferProductDetails(
              offer.product_id
            );
            const shop = await offerModel.getOfferShopDetails(offer.shop_id);
            const account = await offerModel.getOfferAccountDetails(
              offer.account_id
            );
            const shippingMethod = await offerModel.getOfferProductShippingMethod(
              offer.shipping_method_id
            );
            offer.product = Object.assign({}, product);
            offer.shop = Object.assign({}, shop);
            offer.account = Object.assign({}, account);
            offer.shipping_method = Object.assign({}, shippingMethod);
            delete offer.product_id;
            delete offer.shop_id;
            delete offer.account_id;
            delete offer.shipping_method_id;
            return offer;
          })
        );
      });
    const totalCount = await offerModel.getShopOffersTotalCount(
      shop_id,
      date_from,
      date_to
    );
    return {
      shop_offers: shopOffers,
      total_count: totalCount,
    };
  },
  async getShopOffersTotalCount(shop_id, date_from, date_to) {
    return await knex("offer")
      .count("id")
      .where("shop_id", shop_id)
      .andWhere("created_at", ">=", `${date_from}:00:00:00`)
      .andWhere("created_at", "<=", `${date_to}:23:59:59`)
      .then((result) => result[0].count);
  },
  async cancelOffer({ offer_id, user_id }) {
    return await knex("offer")
      .where("id", offer_id)
      .update({ status: "cancelled", cancelled_by: user_id })
      .returning(["id"])
      .then((result) => result[0]);
  },
};

module.exports = offerModel;
