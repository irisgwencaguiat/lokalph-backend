exports.up = function (knex) {
  return knex.schema.createTable("account_type", function (table) {
    table.integer("id").primary();
    table.string("type");
    table.string("label");
    table.string("description");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("account_type");
};
