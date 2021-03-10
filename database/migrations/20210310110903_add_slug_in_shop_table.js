exports.up = function (knex) {
  return knex.schema.table("shop", function (table) {
    table.string("slug");
  });
};

exports.down = function (knex) {
  return knex.schema.table("shop", function (table) {
    table.dropColumn("slug");
  });
};
