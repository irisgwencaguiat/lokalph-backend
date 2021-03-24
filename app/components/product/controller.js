const productModel = require("./model");
const imageModel = require("../image/model");
const keywordModel = require("../keyword/model");
const shippingMethodModel = require("../shipping-method/model");
const utilityController = require("../utility/controller");
const cloudinaryController = require("../cloudinary/controller");
const httpResource = require("../../http_resource");
const validator = require("validator");

const productController = {
  async createProduct(request, response) {
    try {
      const {
        shop_id,
        name,
        description,
        stock,
        price,
        sale_price,
        product_category_id,
        product_condition_id,
        shipping_method_ids,
        keywords,
      } = request.body;

      if (!shop_id) throw "Shop id field is empty.";
      if (!name) throw "Name field is empty.";
      if (!stock) throw "Stock field is empty.";
      if (!price) throw "Price field is empty.";
      if (!product_category_id) throw "Product Category Id field is empty.";
      if (!product_condition_id) throw "Product condition id field is empty.";
      if (!shipping_method_ids) throw "Shipping Method id field is empty.";

      const parsedShopId = parseFloat(shop_id);
      const parsedStock = parseFloat(stock);
      const parsedPrice = parseFloat(price);
      const parsedSalePrice = sale_price ? parseFloat(sale_price) : 0;
      const parsedProductCategoryId = parseFloat(product_category_id);
      const parsedProductConditionId = parseFloat(product_condition_id);
      const parsedProductShippingMethodIds = await shipping_method_ids.map(
        (methodId) => {
          return parseFloat(methodId);
        }
      );

      const images = request.files || [];

      if (parsedStock < 1) throw "Stock can't be less than 1.";
      if (parsedPrice < 1) throw "Price can't be less than 1.";

      if (isNaN(parsedStock) || typeof parsedStock !== "number")
        throw "Stock should only be an integer.";
      if (isNaN(parsedPrice) || typeof parsedPrice !== "number")
        throw "Price should only be an integer.";
      if (isNaN(parsedSalePrice) || typeof parsedSalePrice !== "number")
        throw "Sale price should only be an integer.";

      if (validator.isEmpty(name)) throw "Name field is empty.";
      if (images.length < 1) {
        throw "Images field is empty.";
      }

      const slugifiedName = await utilityController.slugify(name);
      const doesProductExist = await productModel.doesProductExist(
        parsedShopId,
        slugifiedName
      );

      if (doesProductExist) throw `Product ${name} already exist.`;
      const createdProduct = await productModel.createProduct({
        shop_id: parsedShopId,
        name,
        slug: slugifiedName,
        description,
        stock: parsedStock,
        price: parsedPrice,
        sale_price: parsedSalePrice,
        product_category_id: parsedProductCategoryId,
        product_condition_id: parsedProductConditionId,
      });

      for await (let methodId of parsedProductShippingMethodIds) {
        await productModel.createProductShippingMethod({
          shipping_method_id: methodId,
          product_id: createdProduct.id,
        });
      }

      for await (let keyword of keywords) {
        const savedKeyword = await keywordModel.createKeyword({
          name: keyword,
        });
        await productModel.createProductKeyword({
          keyword_id: savedKeyword.id,
          product_id: createdProduct.id,
        });
      }

      for await (let image of images) {
        const folderPath = "products";
        const uploadedImage = await cloudinaryController.upload(
          image,
          folderPath
        );
        const savedImage = await imageModel.createImage({
          url: uploadedImage.url,
          public_id: uploadedImage.publicID,
        });
        await productModel.createProductImage({
          image_id: savedImage.id,
          product_id: createdProduct.id,
        });
      }

      const productDetails = await productModel.getProductDetails(
        createdProduct.id
      );

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: productDetails,
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

  async getProductCategories(request, response) {
    try {
      const categories = await productModel.getProductCategories();
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Records successfully got.",
          data: categories,
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

  async getProductConditions(request, response) {
    try {
      const conditions = await productModel.getProductConditions();
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Records successfully got.",
          data: conditions,
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

  async getProductShippingMethods(request, response) {
    try {
      const shippingMethods = await shippingMethodModel.getShippingMethods();
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Records successfully got.",
          data: shippingMethods,
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

  async getShopProducts(request, response) {
    try {
      const shopId = parseInt(request.params.shop_id);
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const sort = request.query.sort || "asc";
      const search = request.query.search || null;
      const payload = {
        shopId,
        page,
        perPage,
        sort,
        search,
      };
      let shops = [];
      if (search) shops = await productModel.searchShopProducts(payload);
      if (!search) shops = await productModel.getShopProducts(payload);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: shops,
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
  async getProductDetailsBySlug(request, response) {
    try {
      const { slug } = request.params;
      const productDetails = await productModel.getProductDetailsBySlug(slug);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productDetails,
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
  async createProductInquiry(request, response) {
    try {
      const { product_id, message } = request.body;
      const { id } = request.user;
      console.log(product_id);
      console.log(message);
      console.log(id);
      const createdPoductInquiry = await productModel.createProductInquiry({
        product_id,
        message,
        account_id: id,
      });
      const productInquiryDetails = await productModel.getProductInquiryById(
        createdPoductInquiry.id
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productInquiryDetails,
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

module.exports = productController;
