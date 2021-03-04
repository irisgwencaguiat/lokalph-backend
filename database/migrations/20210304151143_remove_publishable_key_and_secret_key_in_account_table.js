exports.up = function (knex) {
  return knex.schema.table("account", function (table) {
    table.dropColumn("publishable_key");
    table.dropColumn("secret_key");
  });
};

exports.down = function (knex) {
  return knex.schema.table("account", function (table) {
    table.string("publishable_key");
    table.string("secret_key");
  });
};
