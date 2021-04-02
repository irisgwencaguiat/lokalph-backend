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
};

module.exports = transactionModel;
