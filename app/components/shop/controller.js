const accountModel = require("../account/model");
const addressModel = require("../address/model");
const stripeModel = require("../stripe/model");
const shopModel = require("../shop/model");
const httpResource = require("../../http_resource");
const validator = require("validator");

const shopController = {
  async createShop(request, response) {
    try {
      const accountId = request.user.id;
      const {
        name,
        introduction,
        address,
        contact_number,
        stripe,
      } = request.body;

      if (!name) throw "Name field is empty.";
      if (!contact_number) throw "Contact number field is empty.";
      if (!address) throw "Address field is empty.";
      if (validator.isEmpty(name)) throw "Name field is empty.";
      if (validator.isEmpty(contact_number))
        throw "Contact number field is empty.";
      if (name.length > 35) throw "Shop name should not exceed 35 characters";
      if (contact_number.length < 10)
        throw "Contact number should not be less than 10 characters.";
      if (contact_number.length > 15)
        throw "Contact number should not exceed 15 characters.";
      if (introduction) {
        if (introduction.length < 3)
          throw "Introduction should not be less than 3 characters";
        if (introduction.length > 101)
          throw "Introduction should not exceed 101 characters";
      }
      const gotShopDetailsByName = await shopModel.getShopDetailsByName(name);
      if (gotShopDetailsByName) throw `${name} is already taken`;
      const createdAddressDetails = await addressModel.createAddress(address);
      const gotAccountDetails = await accountModel.getDetails(accountId);
      if (!gotAccountDetails.stripe) {
        if (!stripe.publishable_key) throw "Stripe publishable key is empty.";
        if (!stripe.secret_key) throw "Stripe secret key is empty.";
        const createdStripeDetails = await stripeModel.createStripe({
          publishableKey: stripe.publishable_key,
          secretKey: stripe.secret_key,
        });
        await accountModel.updateStripeId(accountId, createdStripeDetails.id);
      }
      if (gotAccountDetails.account_type.id === 1)
        await accountModel.updateAccountType(accountId, 2);
      const createdShop = await shopModel.createShop({
        name,
        introduction,
        address_id: createdAddressDetails.id,
        contact_number,
        account_id: accountId,
      });
      const gotShopDetails = await shopModel.getShopDetails(createdShop.id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: gotShopDetails,
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

  async getAccountShops(request, response) {
    try {
      const accountId = parseInt(request.params.account_id);
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const sort = request.query.sort || "asc";
      const search = request.query.search || null;
      const payload = {
        accountId,
        page,
        perPage,
        sort,
        search,
      };
      let shops = [];
      if (search) shops = await shopModel.searchAccountShops(payload);
      if (!search) shops = await shopModel.getAccountShops(payload);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: shops,
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

module.exports = shopController;
