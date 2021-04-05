const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");

const transactionModel = {
  async createTransaction(input) {
    return await knex("transaction")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getTransactionDetailsById(id) {
    return await knex("transaction")
      .where("id", id)
      .then((result) => result[0]);
  },
  async doesCodeInShopExist(shopId, code) {
    return await knex("transaction")
      .where("shop_id", shopId)
      .andWhere("code", code)
      .then((result) => {
        return result.length > 0;
      });
  },
  async getShopTransactions({ shopId, page, perPage }) {
    return await knex("transaction")
      .where("shop_id", shopId)
      .orderBy("created_at", "desc")
      .paginate({
        perPage,
        currentPage: page,
      })
      .then((result) => {
        if (result.data.length < 1) return [];
        return result.data;
      });
  },
  async getShopTransactionsCount(shopId) {
    return await knex("transaction")
      .count("id")
      .where("shop_id", shopId)
      .then((result) => result[0].count);
  },
  async getAccountTransactions({ account_id, page, perPage }) {
    return await knex("transaction")
      .where("account_id", account_id)
      .orderBy("created_at", "desc")
      .paginate({
        perPage,
        currentPage: page,
      })
      .then(async (result) => {
        if (result.data.length < 1) return [];
        return result.data;
      });
  },
  async getAccountTransactionsTotalCount(accountId) {
    return await knex("transaction")
      .count("id")
      .where("account_id", accountId)
      .then((result) => result[0].count);
  },
};

module.exports = transactionModel;
