exports.up = function (knex) {
  return knex.schema.createTable("keyword", function (table) {
    table.increments();
    table.string("name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("keyword");
};
