exports.up = function (knex) {
  return knex.schema.createTable("transaction", function (table) {
    table.increments();
    table.date("date");
    table.time("time");
    table.integer("account_id").references("id").inTable("account");
    table.integer("shop_id").references("id").inTable("shop");
    table.integer("address_id").references("id").inTable("address");
    table.integer("offer_id").references("id").inTable("offer");
    table.integer("product_id").references("id").inTable("product");
    table.string("cancelled_by");
    table.integer("received_by").references("id").inTable("account");
    table.string("status").defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.string("code");
    table.boolean("is_reviewed").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("transaction");
};
