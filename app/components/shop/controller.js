const accountModel = require("../account/model");
const addressModel = require("../address/model");
const shopModel = require("../shop/model");
const httpResource = require("../../http_resource");
const validator = require("validator");

const shopController = {
  createShop: async (request, response) => {
    try {
      const account_id = request.user.id;
      const { name, introduction, address, contact_number } = request.body;
      if (!name) throw "Name field is empty.";
      if (!contact_number) throw "Contact number field is empty.";
      for (let [key, value] of Object.entries(address)) {
        if (!value) {
          throw `${key} field is null empty`;
        }
      }
      if (validator.isEmpty(name)) throw "Name field is empty.";
      if (validator.isEmpty(contact_number))
        throw "Contact number field is empty.";
      for (let [key, value] of Object.entries(address)) {
        if (validator.isEmpty(value)) {
          throw `${key} field is empty.`;
        }
      }
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
      const doesShopNameExist = await shopModel.getShopDetailsByName(name);
      if (doesShopNameExist) throw `${name} is already taken`;
      const createdAddressDetails = await addressModel.createAddress(address);
      const createdShopDetails = await shopModel.createShop({
        name,
        introduction,
        address_id: createdAddressDetails.id,
        contact_number,
        account_id,
      });
      const sellerAccountId = 2;
      await accountModel.updateAccountType(account_id, sellerAccountId);
      const fullShopDetails = await shopModel.getShopDetails(
        createdShopDetails.id
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: fullShopDetails,
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
