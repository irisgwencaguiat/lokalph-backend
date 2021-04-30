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
  async getShopRooms({ shopId, page, perPage, sort }) {
    return await knex("room")
      .where("shop_id", shopId)
      .paginate({
        perPage,
        currentPage: page,
      })
      .then((result) => result.data);
  },
  async searchShopRooms({ shopId, page, perPage, search }) {
    return await knex("room")
      .whereIn("account_id", search)
      .andWhere("shop_id", shopId)
      .paginate({
        perPage,
        currentPage: page,
      })
      .then((result) => result.data);
  },
  async getShopRoomTotalCount(shopId) {
    return await knex("room")
      .count("id")
      .where("shop_id", shopId)
      .then((result) => parseInt(result[0].count));
  },
  async searchRoomTotalCount(shopId, search) {
    return await knex("room")
      .count("id")
      .whereIn("account_id", search)
      .where("shop_id", shopId)
      .then((result) => parseInt(result[0].count));
  },
  async updateRoomUpdatedTime(roomId) {
    return await knex("room")
      .where("id", roomId)
      .update("updated_at", knex.fn.now())
      .returning(["id"])
      .then((result) => result[0]);
  },
};

module.exports = chatModel;
