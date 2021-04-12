exports.up = function (knex) {
  return knex.schema.createTable("shop_review", function (table) {
    table.increments();
    table.string("text");
    table.integer("rating");
    table.integer("shop_id").references("id").inTable("shop");
    table.integer("account_id").references("id").inTable("account");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("shop_review");
};
