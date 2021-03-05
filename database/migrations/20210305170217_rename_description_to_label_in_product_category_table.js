exports.up = function (knex) {
  return knex.schema.table("product_category", function (table) {
    table.renameColumn("description", "label");
  });
};

exports.down = function (knex) {
  return knex.schema.table("product_category", function (table) {
    table.renameColumn("label", "description");
  });
};
