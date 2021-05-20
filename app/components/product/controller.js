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
      const { shop_id, product_slug } = request.params;
      const productDetails = await productModel.getProductDetailsBySlug({
        shop_id: parseInt(shop_id),
        product_slug,
      });
      if (!productDetails) throw "Product does not exist.";
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
      if (message.length === 0) throw "Message field is empty.";

      if (message.length > 100)
        throw "Inquiry message shouldn't exceed 100 characters.";

      if (!product_id) throw "Product Id field is empty.";

      const createdProductInquiry = await productModel.createProductInquiry({
        product_id,
        message,
        account_id: id,
      });
      const productInquiryDetails = await productModel.getProductInquiryById(
        createdProductInquiry.id
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
  async getProductInquiries(request, response) {
    try {
      const productId = parseInt(request.params.product_id);
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const sort = request.query.sort || "desc";
      const payload = {
        productId,
        page,
        perPage,
        sort,
      };
      let productInquiries = await productModel.getProductInquiries(payload);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productInquiries,
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
  async createProductInquiryReply(request, response) {
    try {
      const { product_id, product_inquiry_id, message } = request.body;
      const { id } = request.user;
      if (!message) throw "Message field is empty.";
      if (message.length === 0) throw "Message field is empty.";
      if (message.length > 2500)
        throw "Inquiry message shouldn't exceed 100 characters.";
      if (!product_id) throw "Product Id field is empty.";
      if (!product_inquiry_id) throw "Product inquiry field is empty";
      const createdProductInquiryReply = await productModel.createProductInquiryReply(
        {
          product_id,
          product_inquiry_id,
          message,
          account_id: id,
        }
      );

      const productInquiryReplyDetails = await productModel.getProductInquiryReplyById(
        createdProductInquiryReply.id
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productInquiryReplyDetails,
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
  async getProductInquiryReply(request, response) {
    try {
      const productInquiryId = parseInt(request.params.product_inquiry_id);
      const productInquiryReplyDetails = await productModel.getProductInquiryReply(
        productInquiryId
      );

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productInquiryReplyDetails,
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
  async createProductView(request, response) {
    try {
      const { id } = request.user;
      const { product_id } = request.body;
      const doesProductViewExist = await productModel.doesProductViewExist(
        id,
        product_id
      );
      let productView;
      if (doesProductViewExist) {
        productView = null;
      } else {
        productView = await productModel.createProductView({
          account_id: id,
          product_id,
        });
      }

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productView,
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
  async getProductViews(request, response) {
    try {
      const productId = parseInt(request.params.product_id);
      const productViewCount = await productModel.getProductViews(productId);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: parseInt(productViewCount),
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
  async createProductLike(request, response) {
    try {
      const { id } = request.user;
      const { product_id } = request.body;
      const doesProductLikeExist = await productModel.doesProductLikeExist(
        id,
        product_id
      );
      let productLike;
      if (doesProductLikeExist) {
        productLike = null;
      } else {
        const createdProductLike = await productModel.createProductLike({
          account_id: id,
          product_id,
        });
        productLike = await productModel.getProductLikeDetailsById(
          createdProductLike.id
        );
      }
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productLike,
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
  async getProductLikes(request, response) {
    try {
      const productId = parseInt(request.params.product_id);
      const productLikes = await productModel.getProductLikes(productId);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productLikes,
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
  async deleteProductLike(request, response) {
    try {
      const { id } = request.user;
      const productId = parseInt(request.params.product_id);

      const doesProductLikeExist = await productModel.doesProductLikeExist(
        id,
        productId
      );
      let productLike;
      if (doesProductLikeExist) {
        productLike = await productModel.getProductLike(productId, id);
        await productModel.deleteProductLike(productId, id);
      } else {
        productLike = null;
      }
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productLike,
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
  async searchProduct(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const sort = request.query.sort || "desc";
      const search = request.query.search || null;
      const payload = {
        page,
        perPage,
        sort,
        search,
      };
      const totalCount = await productModel.searchProductTotalCount(payload);
      const foundProducts = await productModel.searchProduct(payload);
      const productsDetails = await Promise.all(
        foundProducts.map(async (product) => {
          return await productModel.getProductDetails(product.id);
        })
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: {
            products: productsDetails,
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
  async getProductsByCategory(request, response) {
    try {
      const { name } = request.params;
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const sort = request.query.sort || "desc";
      const productCategory = await productModel.getProductCategoryByName(name);
      const payload = {
        id: productCategory.id,
        page,
        perPage,
        sort,
      };
      const totalCount = await productModel.getProductsByCategoryTotalCount(
        payload
      );
      const products = await productModel.getProductsByCategory(payload);
      const productsDetails = await Promise.all(
        products.map(async (product) => {
          return await productModel.getProductDetails(product.id);
        })
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: {
            products: productsDetails,
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
  async getProductCategoryByName(request, response) {
    try {
      const { name } = request.params;
      const productCategory = await productModel.getProductCategoryByName(name);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: productCategory,
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
  async getHotProducts(request, response) {
    try {
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.per_page) || 5;
      const payload = {
        page,
        perPage,
      };
      const totalCount = await productModel.getHotProductsTotalCount();
      const products = await productModel.getHotProducts(payload);
      const productDetails = await Promise.all(
        products.map(async (product) => {
          return await productModel.getProductDetails(product.id);
        })
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Successfully got records.",
          data: {
            products: productDetails,
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
    async getNewProducts(request, response) {
        try {
            const page = parseInt(request.query.page) || 1;
            const perPage = parseInt(request.query.per_page) || 5;
            const payload = {
                page,
                perPage,
            };
            const totalCount = await productModel.getNewProductsTotalCount();
            const products = await productModel.getNewProducts(payload);
            console.log(products)
            const productDetails = await Promise.all(
                products.map(async (product) => {
                    return await productModel.getProductDetails(product.id);
                })
            );
            response.status(200).json(
                httpResource({
                    success: true,
                    code: 200,
                    message: "Successfully got records.",
                    data: {
                        products: productDetails,
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

module.exports = productController;
