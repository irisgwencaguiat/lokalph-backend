exports.up = function (knex) {
  return knex.schema.createTable("stripe", function (table) {
    table.increments();
    table.string("publishable_key");
    table.string("secret_key");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("stripe");
};
