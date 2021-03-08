exports.up = function (knex) {
  return knex.schema.table("product", function (table) {
    table.renameColumn("quantity", "stock");
  });
};

exports.down = function (knex) {
  return knex.schema.table("product", function (table) {
    table.renameColumn("stock", "quantity");
  });
};
