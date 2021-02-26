const knex = require("../../../database/knex");
const profileModel = require("../profile/model");

const accountModel = {
  tableName: "account",

  register: async ({ email, password, profile_id, account_type_id }) => {
    return await knex(accountModel.tableName)
      .insert({
        email,
        password,
        profile_id,
        account_type_id,
      })
      .returning(["id", "profile_id", "account_type_id"])
      .then((result) => {
        return result[0];
      });
  },
  getAccountDetails: async (id) => {
    return await knex(`${accountModel.tableName} as account`)
      .where("account.id", id)
      .then(async (result) => {
        const account = result[0];
        const profile = await knex("profile")
          .where("profile.id", account.profile_id)
          .then((result2) => result2[0]);
        const account_type = await knex("account_type")
          .where("account_type.id", account.account_type_id)
          .then((result2) => result2[0]);
        account.profile = Object.assign({}, profile);
        account.account_type = Object.assign({}, account_type);
        delete account.password;
        return account;
      });
  },
  getAccountDetailsByEmail: async (email) => {
    return await knex
      .select("account.id", "account.password")
      .from(accountModel.tableName)
      .where("email", email)
      .then((result) => {
        return result[0];
      });
  },
};

module.exports = accountModel;
