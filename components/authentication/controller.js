const profileModel = require("../profile/model");
const accountModel = require("../account/model");
const jsonwebtoken = require("jsonwebtoken");

const authenticationController = {
  register: async (request, response) => {
    // Validations
    const profileRegisterResult = await profileModel.register({
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      birth_date: request.body.birth_date,
      introduction: request.body.introduction,
    });
    const accountRegisterResult = await accountModel.register({
      email: request.body.email,
      password: request.body.password,
      profile_id: profileRegisterResult.id,
      account_type_id: 1,
    });
    const details = await accountModel.getAccountDetails(
      accountRegisterResult.id
    );
    const token = jsonwebtoken.sign(
      details,
      process.env.AUTHENTICATION_SECRET_OR_KEY
    );
    response.status(200).json({
      user: details,
      token,
    });
  },
};

module.exports = authenticationController;
