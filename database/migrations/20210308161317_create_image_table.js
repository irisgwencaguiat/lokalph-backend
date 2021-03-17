exports.up = function (knex) {
  return knex.schema.createTable("image", function (table) {
    table.increments();
    table.string("url");
    table.string("public_id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("image");
};
