const reviewModel = require("./model");
const transactionModel = require("../transaction/model");
const productModel = require("../product/model");
const shopModel = require("../shop/model");
const accountModel = require("../account/model");
const cloudinaryController = require("../cloudinary/controller");
const imageModel = require("../image/model");
const httpResource = require("../../http_resource");

const reviewController = {
  async createReview(request, response) {
    try {
      const { id } = request.user;
      const {
        product_review,
        product_rating,
        shop_review,
        shop_rating,
        transaction_id,
      } = request.body;
      const transaction = await transactionModel.getTransactionDetailsById(
        transaction_id
      );
      const images = request.files || [];

      if (!parseInt(product_rating)) throw "Product rating field is empty.";
      if (!parseInt(shop_rating)) throw "Product rating field is empty.";
      if (parseInt(product_rating) < 1 || parseInt(product_rating) > 5) {
        throw "Product rating minimum is 1 and maximum is 5.";
      }
      if (parseInt(shop_rating) < 1 || parseInt(shop_rating) > 5) {
        throw "Shop rating minimum is 1 and maximum is 5.";
      }
      const createdProductReview = await reviewModel.createProductReview({
        product_id: parseInt(transaction.product_id),
        account_id: parseInt(id),
        text: product_review || null,
        rating: parseInt(product_rating),
      });
      const createdShopReview = await reviewModel.createShopReview({
        shop_id: parseInt(transaction.shop_id),
        account_id: parseInt(id),
        text: shop_review || null,
        rating: parseInt(shop_rating),
      });

      for await (let image of images) {
        const folderPath = "reviews";
        const uploadedImage = await cloudinaryController.upload(
          image,
          folderPath
        );
        const savedImage = await imageModel.createImage({
          url: uploadedImage.url,
          public_id: uploadedImage.publicID,
        });
        await reviewModel.createProductReviewImage({
          image_id: savedImage.id,
          product_review_id: createdProductReview.id,
        });
      }
      await transactionModel.transactionIsReviewed(transaction_id);

      const productReviewDetails = await reviewModel.getProductReviewById(
        createdProductReview.id
      );
      const productReviewProduct = await productModel.getProductDetails(
        productReviewDetails.product_id
      );
      const productReviewAccount = await accountModel.getDetails(
        productReviewDetails.account_id
      );
      const productReviewImages = await reviewModel.getProductReviewImage(
        productReviewDetails.id
      );
      productReviewDetails.product = Object.assign({}, productReviewProduct);
      productReviewDetails.account = Object.assign({}, productReviewAccount);
      productReviewDetails.images = Object.assign([], productReviewImages);
      delete productReviewDetails.product_id;
      delete productReviewDetails.account_id;

      const shopReviewDetails = await reviewModel.getShopReviewById(
        createdShopReview.id
      );
      const shopReviewShop = await shopModel.getShopDetails(
        shopReviewDetails.shop_id
      );
      const shopReviewAccount = await accountModel.getDetails(
        shopReviewDetails.account_id
      );
      shopReviewDetails.shop = Object.assign({}, shopReviewShop);
      shopReviewDetails.account = Object.assign({}, shopReviewAccount);
      delete shopReviewDetails.shop_id;
      delete shopReviewDetails.account_id;

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: {
            product_review: productReviewDetails,
            shop_review: shopReviewDetails,
          },
        })
      );
    } catch (error) {
      response.status(400).json(
        httpResource({
          success: false,
          code: 400,
          message: error,
        })
      );
    }
  },
  async getProductReviews(request, response) {
    try {
      const productId = parseInt(request.params.product_id);
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const search = parseInt(request.query.search) || null;
      const payload = {
        productId,
        page,
        perPage,
        search,
      };
      let productReviews = [];
      if (search)
        productReviews = await reviewModel.searchProductReviews(payload);
      if (!search)
        productReviews = await reviewModel.getProductReviews(payload);

      const productReviewsDetails = await Promise.all(
        productReviews.data.map(async (data) => {
          const productReviewDetails = data;
          const productReviewProduct = await productModel.getProductDetails(
            productReviewDetails.product_id
          );
          const productReviewAccount = await accountModel.getDetails(
            productReviewDetails.account_id
          );
          const productReviewImages = await reviewModel.getProductReviewImage(
            productReviewDetails.id
          );
          productReviewDetails.product = Object.assign(
            {},
            productReviewProduct
          );
          productReviewDetails.account = Object.assign(
            {},
            productReviewAccount
          );
          productReviewDetails.images = Object.assign([], productReviewImages);
          delete productReviewDetails.product_id;
          delete productReviewDetails.account_id;
          return productReviewDetails;
        })
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: {
            product_review: productReviewsDetails,
            total_count: parseInt(productReviews.pagination.total),
          },
        })
      );
    } catch (error) {
      response.status(400).json(
        httpResource({
          success: false,
          code: 400,
          message: error,
        })
      );
    }
  },
};

module.exports = reviewController;
