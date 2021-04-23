const pg = require("pg");
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const knex = require("../../../database/knex");

const chatModel = {
  async createRoom(input) {
    return await knex("room")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async createChat(input) {
    return await knex("chat")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async createChatRoom(input) {
    return await knex("chat_room")
      .insert({ ...input })
      .returning(["id"])
      .then((result) => result[0]);
  },
  async getChatRoomDetailsById(id) {
    return await knex("chat_room")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getRoomDetailsById(id) {
    return await knex("room")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getLastChatDetailsById(id) {
    return await knex("chat")
      .where("id", id)
      .then((result) => result[0]);
  },
  async getLastChatRoomDetailsByRoomId(roomId) {
    return await knex("chat_room")
      .where("room_id", roomId)
      .orderBy("created_at", "desc")
      .then((result) => result[0]);
  },
  async doesRoomExist(shopId, accountId, productId) {
    return await knex("room")
      .where("shop_id", shopId)
      .andWhere("account_id", accountId)
      .andWhere("product_id", productId)
      .then((result) => result || []);
  },
  async getChatRoomByRoomId(roomId) {
    return await knex("chat_room")
      .where("room_id", roomId)
      .then((result) => result[0]);
  },
};

module.exports = chatModel;
