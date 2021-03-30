exports.up = function (knex) {
  return knex.schema.createTable("offer", function (table) {
    table.increments();
    table.string("note");
    table.string("status").defaultTo("pending");
    table.integer("quantity");
    table.decimal("total_price", 14, 2);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table
      .integer("cancelled_by")
      .references("id")
      .inTable("account")
      .defaultTo(null);
    table.integer("shop_id").references("id").inTable("shop");
    table.integer("product_id").references("id").inTable("product");
    table.integer("account_id").references("id").inTable("account");
    table
      .integer("shipping_method_id")
      .references("id")
      .inTable("shipping_method");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("offer");
};
