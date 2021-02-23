const profileModel = require("../profile/model");
const accountModel = require("../account/model");

const authenticationController = {
  register: async (request, response) => {
    const profileIdResult = await profileModel.register({
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      birth_date: request.body.birth_date,
      introduction: request.body.introduction,
    });

    const accountDetails = await accountModel.register({
      email: request.body.email,
      password: request.body.password,
      profile_id: profileIdResult.id,
      account_type_id: 1,
    });
    const result = await accountModel.getAccountDetails(
      accountDetails.id,
      accountDetails.profile_id,
      accountDetails.account_type_id
    );
    response.json(result);
  },
};

module.exports = authenticationController;
