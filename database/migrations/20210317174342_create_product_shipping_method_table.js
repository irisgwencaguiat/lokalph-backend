exports.up = function (knex) {
  return knex.schema.createTable("product_shipping_method", function (table) {
    table.increments();
    table
      .integer("shipping_method_id")
      .references("id")
      .inTable("shipping_method");
    table.integer("product_id").references("id").inTable("product");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_shipping_method");
};
