exports.up = function (knex) {
  return knex.schema.table("product", (table) => {
    table.text("description").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.table("product", (table) => {
    table.string("description").alter();
  });
};
