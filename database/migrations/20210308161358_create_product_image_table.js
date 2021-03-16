exports.up = function (knex) {
  return knex.schema.createTable("product_image", function (table) {
    table.increments();
    table.integer("image_id").references("id").inTable("image");
    table.integer("product_id").references("id").inTable("product");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_image");
};
