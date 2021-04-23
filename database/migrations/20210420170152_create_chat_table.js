exports.up = function (knex) {
  return knex.schema.createTable("chat", function (table) {
    table.increments();
    table.string("message");
    table.string("is_sent_by");
    table.string("image_url");
    table.integer("account_id").references("id").inTable("account");
    table.integer("shop_id").references("id").inTable("shop");
    table.boolean("is_seen_by_shop").defaultTo(false);
    table.boolean("is_seen_by_customer").defaultTo(false);
    table.timestamp("shop_seen_at");
    table.timestamp("customer_seen_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chat");
};
