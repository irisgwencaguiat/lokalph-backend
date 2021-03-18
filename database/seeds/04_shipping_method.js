exports.seed = function (knex) {
  return knex("shipping_method")
    .del()
    .then(function () {
      return knex("shipping_method").insert([
        { id: 1, slug: "meet-up", label: "Meet Up" },
        { id: 2, slug: "pick-up", label: "Pick Up" },
      ]);
    });
};
