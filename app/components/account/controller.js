const accountModel = require("./model");
const httpResource = require("../../http_resource");

const accountController = {
  async getDetailsByEmail(request, response) {
    try {
      const email = request.params.email || null;
      if (!email) throw "Email is empty.";
      const gotAccountDetails = await accountModel.getAccountDetailsByEmail(
        email
      );
      if (!gotAccountDetails) throw "Email not exists.";
      response.status(200).json(
        httpResource({
          success: false,
          code: 200,
          message: gotAccountDetails,
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

module.exports = accountController;
