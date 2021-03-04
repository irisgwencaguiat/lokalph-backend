exports.up = function (knex) {
  return knex.schema.table("account", function (table) {
    table.integer("address_id").references("id").inTable("address");
    table.string("publishable_key");
    table.string("secret_key");
  });
};

exports.down = function (knex) {
  return knex.schema.table("account", function (table) {
    table.dropColumn("address_id");
    table.dropColumn("publishable_key");
    table.dropColumn("secret_key");
  });
};
