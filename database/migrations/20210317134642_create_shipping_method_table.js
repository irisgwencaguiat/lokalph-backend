exports.up = function (knex) {
  return knex.schema.createTable("shipping_method", function (table) {
    table.increments();
    table.string("slug");
    table.string("label");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("shipping_method");
};
