const offerModel = require("./model");
const transactionModel = require("../transaction/model");
const productModel = require("../product/model");
const addressModel = require("../address/model");
const shopModel = require("../shop/model");
const accountModel = require("../account/model");
const httpResource = require("../../http_resource");

const offerController = {
  async createOffer(request, response) {
    try {
      const { id } = request.user;
      const {
        note,
        quantity,
        total_price,
        product_id,
        shop_id,
        shipping_method_id,
      } = request.body;
      const product = await offerModel.getOfferProductDetails(product_id);
      if (!quantity) throw "Quantity can't be empty.";
      if (!total_price) throw "Total price can't be empty.";
      if (quantity < 1) throw "Quantity can't be less than 1.";
      if (quantity > product.stock)
        throw "The quantity cannot exceed the product stock.";
      if (total_price < 1) throw "Total price can't be less than 1.";
      if (note && note.length > 250)
        throw "Note shouldn't exceed 250 characters.";
      const createdOffer = await offerModel.createOffer({
        note: note || null,
        quantity,
        total_price,
        product_id,
        shop_id,
        account_id: id,
        shipping_method_id,
      });
      const offer = await offerModel.getOfferDetailsById(createdOffer.id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: offer,
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
  async getShopOffers(request, response) {
    try {
      const { shop_id, date_from, date_to } = request.params;
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const shopOffers = await offerModel.getShopOffers({
        shop_id: parseInt(shop_id),
        date_from,
        date_to,
        page,
        perPage,
      });

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: shopOffers,
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
  async cancelOffer(request, response) {
    try {
      const { offer_id } = request.body;
      const { id } = request.user;
      if (!offer_id) throw "Offer Id field is empty.";

      const updatedOffer = await offerModel.cancelOffer({
        offer_id,
        user_id: id,
      });
      const offerDetails = await offerModel.getOfferDetailsById(
        updatedOffer.id
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: offerDetails,
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
  async acceptOffer(request, response) {
    try {
      const { offer_id, date, time, address } = request.body;
      if (!offer_id) throw "Offer id field is empty.";
      if (!address) throw "Address fields are empty.";
      const offer = await offerModel.getOfferDetailsById(offer_id);
      const product = await productModel.getProductDetails(offer.product.id);
      const newStock = product.stock - offer.quantity;
      await productModel.updateProductDetails(product.id, { stock: newStock });
      await offerModel.acceptOffer(offer_id);

      const addressDetails = await addressModel.createAddress(address);
      const createdTransaction = await transactionModel.createTransaction({
        offer_id,
        date,
        time,
        address_id: addressDetails.id,
      });
      const transactionDetails = await transactionModel.getTransactionDetailsById(
        createdTransaction.id
      );
      const transactionOfferDetails = await offerModel.getOfferDetailsById(
        transactionDetails.offer_id
      );

      const transactionAddressDetails = await addressModel.getAddressDetails(
        transactionDetails.address_id
      );

      transactionDetails.offer = Object.assign({}, transactionOfferDetails);
      transactionDetails.address = Object.assign({}, transactionAddressDetails);

      delete transactionDetails.offer_id;
      delete transactionDetails.address_id;

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: transactionDetails,
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

module.exports = offerController;
