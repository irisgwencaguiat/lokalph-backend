exports.seed = function (knex) {
  return knex("product_condition")
    .del()
    .then(function () {
      return knex("product_condition").insert([
        { id: 1, slug: "brand-new", label: "Brand New" },
        { id: 2, slug: "secondhand", label: "Secondhand" },
      ]);
    });
};
