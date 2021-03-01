exports.up = function (knex) {
  return knex.schema.table("profile", function (table) {
    table
      .string("image_url")
      .defaultTo("https://dogelore.fandom.com/wiki/Doge?file=Doge.jpg");
  });
};

exports.down = function (knex) {
  return knex.schema.table("profile", function (table) {
    table.dropColumn("image_url");
  });
};
