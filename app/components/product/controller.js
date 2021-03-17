const productModel = require("./model");
const imageModel = require("../image/model");
const utilityController = require("../utility/controller");
const cloudinaryController = require("../cloudinary/controller");
const httpResource = require("../../http_resource");
const validator = require("validator");

const productController = {
  async createProduct(request, response) {
    try {
      console.log(request);
      const {
        shop_id,
        name,
        description,
        stock,
        price,
        sale_price,
        product_category_id,
      } = request.body;

      const parsedShopId = parseFloat(shop_id);
      const parsedStock = parseFloat(stock);
      const parsedPrice = parseFloat(price);
      const parsedSalePrice = parseFloat(sale_price);
      const parsedProductCategoryId = parseFloat(product_category_id);

      const images = request.files || [];

      if (parsedStock < 1) throw "Stock can't be less than 1.";
      if (parsedPrice < 1) throw "Price can't be less than 1.";
      if (parsedSalePrice < 1) throw "Sale price can't be less than 1.";
      if (parsedShopId < 1) throw "Shop Id can't be less than 1.";
      if (parsedProductCategoryId < 1)
        throw "Product category id can't be less than 1.";

      if (!name) throw "Name field is empty.";
      if (!shop_id) throw "Shop id field is empty.";
      if (!stock) throw "Stock field is empty.";
      if (!price) throw "Price field is empty.";
      if (!sale_price) throw "Sale price field is empty.";
      if (!product_category_id) throw "Product category id field is empty";

      if (isNaN(parsedShopId) || typeof parsedShopId !== "number")
        throw "Shop id should only be an integer.";
      if (isNaN(parsedStock) || typeof parsedStock !== "number")
        throw "Stock should only be an integer.";
      if (isNaN(parsedPrice) || typeof parsedPrice !== "number")
        throw "Price should only be an integer.";
      if (isNaN(parsedSalePrice) || typeof parsedSalePrice !== "number")
        throw "Sale price should only be an integer.";
      if (
        isNaN(parsedProductCategoryId) ||
        typeof parsedProductCategoryId !== "number"
      )
        throw "Product category id should only be an integer.";

      if (validator.isEmpty(name)) throw "Name field is empty.";

      const slugifiedName = await utilityController.slugify(name);
      const doesProductExist = await productModel.doesProductExist(
        shop_id,
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
      });

      await Promise.all(
        images.map(async (image) => {
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
        })
      );

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
};

module.exports = productController;
