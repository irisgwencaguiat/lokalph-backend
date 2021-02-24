exports.up = function (knex) {
  return knex.schema.createTable("account", function (table) {
    table.increments();
    table.string("email");
    table.string("password");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("profile_id").references("id").inTable("profile");
    table.integer("account_type_id").references("id").inTable("account_type");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("account");
};
