const knex = require("../../../database/knex");
const profileModel = require("../profile/model");

const accountModel = {
  tableName: "account",

  async register({ email, password, profile_id, account_type_id }) {
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

  async getDetails(id) {
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
          const stripe =
            (await knex("stripe")
              .where("stripe.id", account.stripe_id)
              .then((result2) => result2[0])) || null;
          account.profile = Object.assign({}, profile);
          account.account_type = Object.assign({}, account_type);
          account.stripe = stripe ? Object.assign({}, stripe) : null;
          delete account.password;
          return account;
        })) || null
    );
  },

  async getDetailsByEmail(email) {
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
          const stripe =
            (await knex("stripe")
              .where("stripe.id", account.stripe_id)
              .then((result2) => result2[0])) || null;
          account.profile = Object.assign({}, profile);
          account.account_type = Object.assign({}, account_type);
          account.stripe = stripe ? Object.assign({}, stripe) : null;
          delete account.password;
          return account;
        })) || null
    );
  },

  async getPassword(id) {
    return await knex(`${accountModel.tableName} as account`)
      .select(["password"])
      .where("account.id", id)
      .then((result) => result[0].password || null);
  },

  async updateAccountType(id, accountTypeId) {
    return knex(accountModel.tableName).where("id", id).update({
      account_type_id: accountTypeId,
    });
  },

  async updateStripeId(accountId, stripeId) {
    return knex(accountModel.tableName)
      .where("id", accountId)
      .update({ stripe_id: stripeId });
  },
};

module.exports = accountModel;
