exports.up = function (knex) {
  return knex.schema.createTable("room", function (table) {
    table.increments();
    table.integer("shop_id").references("id").inTable("shop");
    table.integer("account_id").references("id").inTable("account");
    table.integer("product_id").references("id").inTable("product");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("room");
};
