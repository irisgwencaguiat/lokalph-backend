exports.up = function (knex) {
  return knex.schema.createTable("product_category", function (table) {
    table.increments();
    table.string("name");
    table.string("description");
    table.string("image_url");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_category");
};
