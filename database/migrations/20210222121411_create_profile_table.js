exports.up = function (knex) {
  return knex.schema.createTable("profile", function (table) {
    table.increments();
    table.string("first_name");
    table.string("last_name");
    table.date("birth_date");
    table.string("introduction");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("profile");
};
