const chatModel = require("./model");
const accountModel = require("../account/model");
const shopModel = require("../shop/model");
const productModel = require("../product/model");
const profileModel = require("../profile/model");
const cloudinaryController = require("../cloudinary/controller");
const httpResource = require("../../http_resource");
const pusher = require("../../pusher");

const chatController = {
  async createChatRoom(request, response) {
    try {
      const {
        message,
        is_sent_by,
        shop_id,
        account_id,
        product_id,
      } = request.body;
      const image = request.file || null;
      const uploadedImage = await cloudinaryController.upload(image, "chats");
      let event = "";
      let chatRoomDetails = {};
      const doesRoomExist = await chatModel.doesRoomExist(
        parseInt(shop_id),
        parseInt(account_id),
        parseInt(product_id)
      );
      if (doesRoomExist.length > 0) {
        await chatModel.updateRoomUpdatedTime(doesRoomExist[0].id);
        const newChat = await chatModel.createChat({
          message,
          is_sent_by,
          image_url: uploadedImage.url || null,
          shop_id: parseInt(shop_id) || null,
          account_id: parseInt(account_id) || null,
        });
        const newChatRoom = await chatModel.createChatRoom({
          chat_id: newChat.id,
          room_id: doesRoomExist[0].id,
        });
        chatRoomDetails = await chatModel.getChatRoomDetailsById(
          newChatRoom.id
        );
        event = "room";
      }

      if (doesRoomExist.length < 1) {
        const createdRoom = await chatModel.createRoom({
          shop_id: parseInt(shop_id) || null,
          account_id: parseInt(account_id) || null,
          product_id: parseInt(product_id),
        });
        const createdChat = await chatModel.createChat({
          message,
          is_sent_by,
          image_url: uploadedImage.url || null,
          shop_id: parseInt(shop_id) || null,
          account_id: parseInt(account_id) || null,
        });
        const createdChatRoom = await chatModel.createChatRoom({
          room_id: createdRoom.id,
          chat_id: createdChat.id,
        });
        chatRoomDetails = await chatModel.getChatRoomDetailsById(
          createdChatRoom.id
        );
        event = "new-room";
      }
      const room = await chatModel.getRoomDetailsById(
        parseInt(chatRoomDetails.room_id)
      );
      const roomAccount = await accountModel.getDetails(room.account_id);
      const roomShop = await shopModel.getShopDetails(room.shop_id);
      const roomProduct = await productModel.getProductDetails(room.product_id);
      room.account = Object.assign({}, roomAccount);
      room.shop = Object.assign({}, roomShop);
      room.product = Object.assign({}, roomProduct);
      delete room.account_id;
      delete room.shop_id;
      delete room.product_id;

      const lastChatRoom = await chatModel.getLastChatRoomDetailsByRoomId(
        parseInt(chatRoomDetails.room_id)
      );
      const lastChat = await chatModel.getLastChatDetailsById(
        lastChatRoom.chat_id
      );
      const lastChatAccount = await accountModel.getDetails(
        lastChat.account_id
      );
      const lastChatShop = await shopModel.getShopDetails(lastChat.shop_id);
      lastChat.account = Object.assign({}, lastChatAccount);
      lastChat.shop = Object.assign({}, lastChatShop);
      delete lastChat.account_id;
      delete lastChat.shop_id;
      chatRoomDetails.room = Object.assign({}, room);
      chatRoomDetails.last_chat = Object.assign({}, lastChat);
      delete chatRoomDetails.room_id;
      delete chatRoomDetails.chat_id;
      await pusher.trigger(`shop-${shop_id}`, event, chatRoomDetails);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: chatRoomDetails,
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
  async getShopRooms(request, response) {
    try {
      const shopId = parseInt(request.params.shop_id);
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const search = request.query.search || null;
      const payload = {
        shopId,
        page,
        perPage,
        search,
      };
      let totalCount;
      let rooms = [];
      let foundAccounts = [];
      const firstNameExists = await profileModel.getProfileByFirstName(search);
      const lastNameExists = await profileModel.getProfileByLastName(search);
      if (!search) {
        rooms = await chatModel.getShopRooms(payload);
        totalCount = await chatModel.getShopRoomTotalCount(payload.shopId);
      }
      if (search) {
        if (firstNameExists.length > 0) {
          foundAccounts = await Promise.all(
            firstNameExists.map(async (data) => {
              const foundAccount = await accountModel.getDetailsByProfileId(
                data.id
              );
              return foundAccount.id;
            })
          );
        }
        if (lastNameExists.length > 0) {
          foundAccounts = await Promise.all(
            lastNameExists.map(async (data) => {
              const foundAccount = await accountModel.getDetailsByProfileId(
                data.id
              );
              return foundAccount.id;
            })
          );
        }
        payload.search = Object.assign([], foundAccounts);
        rooms = await chatModel.searchShopRooms(payload);
        totalCount = await chatModel.searchRoomTotalCount(
          payload.shopId,
          payload.search
        );
      }
      rooms = await Promise.all(
        rooms.map(async (data) => {
          const room = data;
          const shop = await shopModel.getShopDetails(room.shop_id);
          const account = await accountModel.getDetails(room.account_id);
          const product = await productModel.getProductDetails(room.product_id);
          room.shop = Object.assign({}, shop);
          room.account = Object.assign({}, account);
          room.product = Object.assign({}, product);
          delete room.shop_id;
          delete room.account_id;
          delete room.product_id;
          return room;
        })
      );

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: {
            rooms: rooms,
            total_count: totalCount,
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

module.exports = chatController;
