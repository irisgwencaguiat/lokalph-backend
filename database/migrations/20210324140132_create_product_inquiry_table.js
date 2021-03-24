exports.up = function (knex) {
  return knex.schema.createTable("product_inquiry", function (table) {
    table.increments();
    table.string("message");
    table.integer("product_id").references("id").inTable("product");
    table.integer("account_id").references("id").inTable("account");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_inquiry");
};
