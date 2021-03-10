exports.up = function (knex) {
  return knex.schema.createTable("product", function (table) {
    table.increments();
    table.string("name");
    table.string("slug");
    table.string("description");
    table.integer("quantity");
    table.decimal("price", 14, 2);
    table.decimal("sale_price", 14, 2);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("deleted_at");
    table.boolean("is_disabled").defaultTo(false);
    table.integer("shop_id").references("id").inTable("shop");
    table
      .integer("product_category_id")
      .references("id")
      .inTable("product_category");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product");
};
