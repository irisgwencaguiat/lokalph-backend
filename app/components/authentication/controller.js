const profileModel = require("../profile/model");
const accountModel = require("../account/model");
const utilityController = require("../utility/controller");
const validator = require("validator");
const jsonwebtoken = require("jsonwebtoken");
const httpResource = require("../../http_resource");

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

      if (!first_name) throw "First name field is empty.";
      if (!last_name) throw "Last name field is empty.";
      if (!birth_date) throw "Birth date field is empty.";
      if (!email) throw "Email field is empty.";
      if (!password) throw "Password field is empty.";
      if (validator.isEmpty(first_name)) throw "First name field is empty.";
      if (validator.isEmpty(last_name)) throw "Last name field is empty.";
      if (validator.isEmpty(birth_date)) throw "Birth date field is empty.";
      if (validator.isEmpty(email)) throw "Email field is empty.";
      if (validator.isEmpty(password)) throw "Password field is empty.";
      if (!validator.isEmail(email)) throw "Email is not valid.";
      const doesEmailExist = await accountModel.getAccountDetailsByEmail(email);
      if (doesEmailExist) throw `${email} already exists.`;

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
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: {
            user: details,
            token,
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
  logIn: async (request, response) => {
    try {
      const { email, password } = request.body;
      if (!email) throw "Email field is empty.";
      if (!password) throw "Password field is empty.";
      if (validator.isEmpty(email)) throw "Email field is empty.";
      if (validator.isEmpty(password)) throw "Password field is empty.";

      const gotAccountDetails = await accountModel.getAccountDetailsByEmail(
        email
      );
      const emailDoesNotExist = !gotAccountDetails;

      if (emailDoesNotExist) throw `${email} does not exists.`;

      const isPlainTextValidated = utilityController.validateHashPassword(
        password,
        gotAccountDetails.password
      );
      if (!isPlainTextValidated) throw "Incorrect Password";

      delete gotAccountDetails.password;

      const details = await accountModel.getAccountDetails(
        gotAccountDetails.id
      );
      const token = jsonwebtoken.sign(
        details,
        process.env.AUTHENTICATION_SECRET_OR_KEY
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Log in successfully.",
          data: {
            user: details,
            token,
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
  validateUser: async (request, response) => {
    try {
      const accountID = request.user.id;
      const details = await accountModel.getAccountDetails(accountID);
      delete details.password;
      const token = jsonwebtoken.sign(
        details,
        process.env.AUTHENTICATION_SECRET_OR_KEY
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "User validated.",
          data: {
            user: details,
            token,
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

module.exports = authenticationController;
