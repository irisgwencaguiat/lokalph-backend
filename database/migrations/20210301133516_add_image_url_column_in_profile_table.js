exports.up = function (knex) {
  return knex.schema.table("profile", function (table) {
    table
      .string("image_url")
      .defaultTo(
        "https://i.pinimg.com/originals/8d/ec/f9/8decf9caed777b8d0d698e01270ce308.png"
      );
  });
};

exports.down = function (knex) {
  return knex.schema.table("profile", function (table) {
    table.dropColumn("image_url");
  });
};
