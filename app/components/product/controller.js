const productModel = require("./model");
const utilityController = require("../utility/controller");
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
      } = request.body;

      if (stock < 1) throw "Stock can't be less than 1.";
      if (price < 1) throw "Price can't be less than 1.";
      if (sale_price < 1) throw "Sale price can't be less than 1.";
      if (shop_id < 1) throw "Shop Id can't be less than 1.";
      if (product_category_id < 1)
        throw "Product category id can't be less than 1.";

      if (!name) throw "Name field is empty.";
      if (!shop_id) throw "Shop id field is empty.";
      if (!stock) throw "Stock field is empty.";
      if (!price) throw "Price field is empty.";
      if (!sale_price) throw "Sale price field is empty.";
      if (!product_category_id) throw "Product category id field is empty";

      if (isNaN(shop_id) || typeof shop_id !== "number")
        throw "Shop id should only be an integer.";
      if (isNaN(stock) || typeof stock !== "number")
        throw "Stock should only be an integer.";
      if (isNaN(price) || typeof price !== "number")
        throw "Price should only be an integer.";
      if (isNaN(sale_price) || typeof sale_price !== "number")
        throw "Sale price should only be an integer.";
      if (isNaN(product_category_id) || typeof product_category_id !== "number")
        throw "Product category id should only be an integer.";

      if (validator.isEmpty(name)) throw "Name field is empty.";

      const slugifiedName = await utilityController.slugify(name);
      console.log(slugifiedName);
      const doesProductExist = await productModel.doesProductExist(
        shop_id,
        slugifiedName
      );

      if (doesProductExist) throw `Product ${name} already exist.`;
      const createdProduct = await productModel.createProduct({
        shop_id,
        name,
        slug: slugifiedName,
        description,
        stock,
        price,
        sale_price,
        product_category_id,
      });

      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: createdProduct,
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
