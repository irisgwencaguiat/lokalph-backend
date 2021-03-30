const offerModel = require("./model");
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
};

module.exports = offerController;
