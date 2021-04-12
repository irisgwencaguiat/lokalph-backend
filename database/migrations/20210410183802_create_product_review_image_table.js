exports.up = function (knex) {
  return knex.schema.createTable("product_review_image", function (table) {
    table.increments();
    table.integer("image_id").references("id").inTable("image");
    table
      .integer("product_review_id")
      .references("id")
      .inTable("product_review");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_review_image");
};
