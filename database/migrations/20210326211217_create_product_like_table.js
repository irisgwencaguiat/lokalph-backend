exports.up = function (knex) {
  return knex.schema.createTable("product_like", function (table) {
    table.increments();
    table.integer("account_id").references("id").inTable("account");
    table.integer("product_id").references("id").inTable("product");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_like");
};
