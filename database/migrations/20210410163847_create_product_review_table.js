exports.up = function (knex) {
  return knex.schema.createTable("product_review", function (table) {
    table.increments();
    table.string("text");
    table.integer("rating");
    table.integer("product_id").references("id").inTable("product");
    table.integer("account_id").references("id").inTable("account");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_review");
};
