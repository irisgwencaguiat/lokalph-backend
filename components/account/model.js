const knex = require("../../database/knex");
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
  getAccountDetails: async (id, profile_id, account_type_id) => {
    return await knex(`${accountModel.tableName} as account`)
      .leftJoin(
        `${profileModel.tableName} as profile`,
        "account.profile_id",
        "profile.id"
      )
      .leftJoin("account_type", "account.account_type_id", "account_type.id")
      .where("account.id", id)
      .then((result) => {
        return result;
      });
  },
};

module.exports = accountModel;
