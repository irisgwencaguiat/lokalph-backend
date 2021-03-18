exports.up = function (knex) {
  return knex.schema.createTable("product_condition", function (table) {
    table.increments();
    table.string("slug");
    table.string("label");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_condition");
};
