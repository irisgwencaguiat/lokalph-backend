const profileModel = require("../profile/model");
const accountModel = require("../account/model");
const utilityController = require("../utility/controller");
const validator = require("validator");
const jsonwebtoken = require("jsonwebtoken");

const authenticationController = {
  register: async (request, response) => {
    try {
      const {
        first_name,
        last_name,
        birth_date,
        email,
        password,
      } = request.body;

      // Validations
      const errors = {};

      if (validator.isEmpty(first_name))
        errors.firstName = "First name field is empty";
      if (validator.isEmpty(last_name))
        errors.lastName = "Last name field is empty";
      if (validator.isEmpty(birth_date))
        errors.birthDate = "Birthdate field is empty";
      if (validator.isEmpty(email)) errors.email = "Email field is empty";
      if (validator.isEmpty(password))
        errors.password = "Password field is empty";

      if (!utilityController.isObjectEmpty(errors)) {
        throw errors;
      }

      if (!validator.isEmail(email)) {
        errors.email = `${email} is not a valid email.`;
        throw errors;
      }

      const doesEmailExist = await accountModel.getAccountDetailsByEmail(email);
      if (doesEmailExist) {
        errors.email = `${email} already exist`;
        throw errors;
      }

      const profileRegisterResult = await profileModel.register({
        first_name,
        last_name,
        birth_date,
      });
      const accountRegisterResult = await accountModel.register({
        email,
        password: utilityController.hashPassword(password),
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
    } catch (error) {
      response.status(400).json(error);
    }
  },
};

module.exports = authenticationController;
