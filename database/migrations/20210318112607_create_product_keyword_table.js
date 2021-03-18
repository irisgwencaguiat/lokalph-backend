exports.up = function (knex) {
  return knex.schema.createTable("product_keyword", function (table) {
    table.increments();
    table.integer("keyword_id").references("id").inTable("keyword");
    table.integer("product_id").references("id").inTable("product");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_keyword");
};
