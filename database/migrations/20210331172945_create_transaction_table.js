exports.up = function (knex) {
  return knex.schema.createTable("transaction", function (table) {
    table.increments();
    table.date("date");
    table.time("time");
    table.integer("account_id").references("id").inTable("account");
    table.integer("shop_id").references("id").inTable("shop");
    table.integer("address_id").references("id").inTable("address");
    table.integer("offer_id").references("id").inTable("offer");
    table.boolean("is_cancelled").defaultTo(false);
    table.integer("cancelled_by").references("id").inTable("account");
    table.boolean("is_received").defaultTo(false);
    table.timestamp("received_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.string("code");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("transaction");
};
