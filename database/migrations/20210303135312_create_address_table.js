exports.up = function (knex) {
  return knex.schema.createTable("address", function (table) {
    table.increments();
    table.string("value");
    table.string("name");
    table.string("county");
    table.string("city");
    table.string("suburb");
    table.string("country");
    table.string("country_code");
    table.string("type");
    table.string("latitude");
    table.string("longitude");
    table.string("postcode");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("address");
};
