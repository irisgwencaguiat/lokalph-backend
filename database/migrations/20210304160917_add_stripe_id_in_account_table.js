exports.up = function (knex) {
  return knex.schema.table("account", function (table) {
    table.integer("stripe_id").references("id").inTable("stripe");
  });
};

exports.down = function (knex) {
  return knex.schema.table("account", function (table) {
    table.dropColumn("stripe_id");
  });
};
