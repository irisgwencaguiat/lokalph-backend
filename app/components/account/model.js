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
    return (
      (await knex(`${accountModel.tableName} as account`)
        .where("account.id", id)
        .then(async (result) => {
          if (!result[0]) return null;
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
        })) || null
    );
  },
  getAccountDetailsByEmail: async (email) => {
    return (
      (await knex(`${accountModel.tableName} as account`)
        .where("account.email", email)
        .then(async (result) => {
          if (!result[0]) return null;
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
        })) || null
    );
  },
  updateAccountType: async (id) => {
    return knex(accountModel.tableName).where("id", id).update({
      account_type_id: 2,
    });
  },
};

module.exports = accountModel;
