exports.up = function (knex) {
  return knex.schema.createTable("shop", function (table) {
    table.increments();
    table.string("name");
    table.string("introduction");
    table.integer("address_id").references("id").inTable("address");
    table.string("contact_number");
    table
      .string("image_url")
      .defaultTo(
        "http://www.clker.com/cliparts/S/e/P/6/M/t/shop-front-icon.svg"
      );
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("deleted_at");
    table.integer("account_id").references("id").inTable("account");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("shop");
};
