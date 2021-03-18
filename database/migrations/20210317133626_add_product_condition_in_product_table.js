exports.up = function (knex) {
  return knex.schema.table("product", function (table) {
    table
      .integer("product_condition_id")
      .references("id")
      .inTable("product_condition");
  });
};

exports.down = function (knex) {
  return knex.schema.table("product", function (table) {
    table.dropColumn("product_condition_id");
  });
};
