exports.up = function (knex) {
  return knex.schema.createTable("chat_room", function (table) {
    table.increments();
    table.integer("room_id").references("id").inTable("room");
    table.integer("chat_id").references("id").inTable("chat");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("chat_room");
};
