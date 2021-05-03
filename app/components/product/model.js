const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");
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

  async getProductAccountDetails(id) {
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
  async getProductShopDetails(id) {
    return await knex("shop")
      .where("id", id)
      .then(async (result) => {
        const shop = result[0];
        const account = await productModel.getProductAccountDetails(
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
  async getProductCategoryDetails(id) {
    return await knex("product_category")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getProductConditionDetails(id) {
    return await knex("product_condition")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getProductImagesDetails(id) {
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
  async getProductKeywordsDetails(id) {
    const productKeywordsDetails = await knex("product_keyword")
      .where("product_id", id)
      .then((result) => result);
    return await Promise.all(
      productKeywordsDetails.map(async (keyword) => {
        return await keywordModel.getKeywordDetails(keyword.keyword_id);
      })
    );
  },
  async getProductShippingMethodsDetails(id) {
    const productShippingMethodsDetails = await knex("product_shipping_method")
      .where("product_id", id)
      .then((result) => result);
    return await Promise.all(
      productShippingMethodsDetails.map(async (method) => {
        return await shippingMethodModel.getShippingMethodDetails(
          method.shipping_method_id
        );
      })
    );
  },
  async getProductDetails(id) {
    return await knex(productModel.tableName)
      .where("id", id)
      .then(async (result) => {
        if (result.length < 1) return null;
        const product = result[0];
        const productCategory = await productModel.getProductCategoryDetails(
          product.product_category_id
        );
        const productCondition = await productModel.getProductConditionDetails(
          product.product_condition_id
        );

        const images = await productModel.getProductImagesDetails(product.id);

        const keywords = await productModel.getProductKeywordsDetails(
          product.id
        );

        const shippingMethods = await productModel.getProductShippingMethodsDetails(
          product.id
        );
        const views = await productModel.getProductViews(product.id);
        const likes = await productModel.getProductLikesTotalCount(product.id);
        const shop = await productModel.getProductShopDetails(product.shop_id);
        product.shop = Object.assign({}, shop);
        product.category = Object.assign({}, productCategory);
        product.condition = Object.assign({}, productCondition);
        product.images = Object.assign([], images);
        product.shipping_methods = Object.assign([], shippingMethods);
        product.keywords = Object.assign([], keywords);
        product.views = views;
        product.likes = likes;
        delete product.shop_id;
        delete product.product_category_id;
        delete product.product_condition_id;
        return product;
      });
  },

  async searchShopProducts({ shopId, page, perPage, sort, search }) {
    return await knex("product")
      .select(["product.id as id"])
      .where("product.shop_id", shopId)
      .andWhereRaw(
        `to_tsvector(product.name || ' ' || product.description) @@ to_tsquery('${search.replace(
          /\s/g,
          ":*&"
        )}')`
      )
      .orderBy("product.created_at", sort)
      .paginate({
        perPage: perPage,
        currentPage: page,
      })
      .then(async (result) => {
        const data = result.data;
        const products = await Promise.all(
          data.map(
            async (item) => await productModel.getProductDetails(item.id)
          )
        );
        const totalCount = await productModel.getShopProductsTotalCount(shopId);
        return {
          products,
          total_count: totalCount,
        };
      });
  },

  async getShopProducts({ shopId, page, perPage, sort }) {
    return knex("product")
      .where("shop_id", shopId)
      .orderBy("created_at", sort)
      .paginate({
        perPage: perPage,
        currentPage: page,
      })
      .then(async (result) => {
        const data = result.data;
        const products = await Promise.all(
          data.map(
            async (item) => await productModel.getProductDetails(item.id)
          )
        );
        const totalCount = await productModel.getShopProductsTotalCount(shopId);
        return {
          products,
          total_count: totalCount,
        };
      });
  },

  async getShopProductsTotalCount(shopId) {
    return knex("product")
      .count("id")
      .where("shop_id", shopId)
      .then((result) => parseInt(result[0].count) || null);
  },
  async getProductDetailsBySlug({ shop_id, product_slug }) {
    return await knex("product")
      .where("slug", product_slug)
      .andWhere("shop_id", shop_id)
      .then(async (result) => {
        const product = result[0];
        if (!product) {
          return;
        }
        const productCategory = await productModel.getProductCategoryDetails(
          product.product_category_id
        );
        const productCondition = await productModel.getProductConditionDetails(
          product.product_condition_id
        );
        const images = await productModel.getProductImagesDetails(product.id);
        const keywords = await productModel.getProductKeywordsDetails(
          product.id
        );
        const shippingMethods = await productModel.getProductShippingMethodsDetails(
          product.id
        );
        const shop = await productModel.getProductShopDetails(product.shop_id);
        const views = await productModel.getProductViews(product.id);
        const likes = await productModel.getProductLikesTotalCount(product.id);
        product.views = views;
        product.likes = likes;
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
  async createProductInquiry(input) {
    return await knex("product_inquiry")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getProductInquiryById(id) {
    return await knex("product_inquiry")
      .where("id", id)
      .then(async (result) => {
        const productInquiry = result[0];
        const account = await productModel.getProductAccountDetails(
          productInquiry.account_id
        );
        const product = await productModel.getProductDetails(
          productInquiry.product_id
        );
        productInquiry.account = Object.assign({}, account);
        productInquiry.product = Object.assign({}, product);
        delete productInquiry.account_id;
        delete productInquiry.product_id;
        return productInquiry;
      });
  },
  async getProductInquiries({ productId, page, perPage, sort }) {
    return await knex("product_inquiry")
      .where("product_id", productId)
      .orderBy("created_at", sort)
      .paginate({
        perPage,
        currentPage: page,
      })
      .then(async (result) => {
        const data = result.data;
        const productInquiries = await Promise.all(
          data.map(async (item) => {
            return await productModel.getProductInquiryById(item.id);
          })
        );
        const totalCount = await productModel.getProductInquiriesTotalCount(
          productId
        );
        return {
          inquiries: productInquiries,
          total_count: totalCount,
        };
      });
  },
  async getProductInquiriesTotalCount(productId) {
    return await knex("product_inquiry")
      .count("id")
      .where("product_id", productId)
      .then((result) => result[0].count);
  },
  async createProductInquiryReply(input) {
    return await knex("product_inquiry_reply")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getProductInquiryReplyById(id) {
    return await knex("product_inquiry_reply")
      .where("id", id)
      .then(async (result) => {
        const productInquiryReply = result[0];
        const productInquiry = await productModel.getProductInquiryById(
          productInquiryReply.product_inquiry_id
        );
        const account = await productModel.getProductAccountDetails(
          productInquiryReply.account_id
        );
        const product = await productModel.getProductDetails(
          productInquiryReply.product_id
        );
        productInquiryReply.account = Object.assign({}, account);
        productInquiryReply.product = Object.assign({}, product);
        productInquiryReply.inquiry = Object.assign({}, productInquiry);
        delete productInquiryReply.account_id;
        delete productInquiryReply.product_id;
        delete productInquiryReply.product_inquiry_id;
        return productInquiryReply;
      });
  },
  async getProductInquiryReply(productInquiryId) {
    return await knex("product_inquiry_reply")
      .where("product_inquiry_id", productInquiryId)
      .then(async (result) => {
        const productInquiryReply = result[0];
        if (!productInquiryReply) {
          return null;
        }
        const productInquiry = await productModel.getProductInquiryById(
          productInquiryReply.product_inquiry_id
        );
        const account = await productModel.getProductAccountDetails(
          productInquiryReply.account_id
        );
        const product = await productModel.getProductDetails(
          productInquiryReply.product_id
        );
        productInquiryReply.account = Object.assign({}, account);
        productInquiryReply.product = Object.assign({}, product);
        productInquiryReply.inquiry = Object.assign({}, productInquiry);
        delete productInquiryReply.account_id;
        delete productInquiryReply.product_id;
        delete productInquiryReply.product_inquiry_id;
        return productInquiryReply;
      });
  },
  async createProductView(input) {
    return await knex("product_view")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => {
        if (result) {
          return null;
        }
      });
  },
  async doesProductViewExist(accountId, productId) {
    return await knex("product_view")
      .where("account_id", accountId)
      .andWhere("product_id", productId)
      .then((result) => {
        return result.length > 0;
      });
  },
  async getProductViews(productId) {
    return await knex("product_view")
      .count("id")
      .where("product_id", productId)
      .then((result) => parseInt(result[0].count));
  },
  async doesProductLikeExist(accountId, productId) {
    return await knex("product_like")
      .where("account_id", accountId)
      .andWhere("product_id", productId)
      .then((result) => {
        return result.length > 0;
      });
  },
  async createProductLike(input) {
    return await knex("product_like")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => {
        return result[0];
      });
  },
  async getProductLikeDetailsById(id) {
    return await knex("product_like")
      .where("id", id)
      .then(async (result) => {
        const productLike = result[0];
        const account = await productModel.getProductAccountDetails(
          productLike.account_id
        );
        const product = await productModel.getProductDetails(
          productLike.product_id
        );
        productLike.account = Object.assign({}, account);
        productLike.product = Object.assign({}, product);
        delete productLike.account_id;
        delete productLike.product_id;
        return productLike;
      });
  },
  async getProductLikes(productId) {
    return await knex("product_like")
      .where("product_id", productId)
      .then(async (result) => {
        return await Promise.all(
          result.map(async (item) => {
            const productLike = item;
            const account = await productModel.getProductAccountDetails(
              productLike.account_id
            );
            productLike.account = Object.assign({}, account);
            delete productLike.account_id;
            return productLike;
          })
        );
      });
  },
  async deleteProductLike(productId, accountId) {
    await knex("product_like")
      .where("product_id", productId)
      .andWhere("account_id", accountId)
      .del();
  },
  async getProductLike(productId, accountId) {
    return await knex("product_like")
      .where("product_id", productId)
      .andWhere("account_id", accountId)
      .then(async (result) => {
        const productLike = result[0];
        const account = await productModel.getProductAccountDetails(
          productLike.account_id
        );
        productLike.account = Object.assign({}, account);
        delete productLike.account_id;
        return productLike;
      });
  },

  async getProductLikesTotalCount(productId) {
    return await knex("product_like")
      .count("id")
      .where("product_id", productId)
      .then((result) => parseInt(result[0].count));
  },
  async updateProductDetails(id, input) {
    return await knex("product")
      .where("id", id)
      .update({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async searchProduct({ page, perPage, sort, search }) {
    return await knex("product")
      .whereRaw("to_tsvector(name) @@ to_tsquery(?)", [search])
      .orderBy("created_at", sort)
      .paginate({
        perPage,
        currentPage: page,
      })
      .then((result) => result.data);
  },
  async searchProductTotalCount({ search }) {
    return await knex("product")
      .count("id")
      .whereRaw("to_tsvector(name) @@ to_tsquery(?)", [search])
      .then((result) => parseInt(result[0].count));
  },
};

module.exports = productModel;
