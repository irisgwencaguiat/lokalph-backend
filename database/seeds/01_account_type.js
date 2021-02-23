exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("account_type")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("account_type").insert([
        {
          id: 1,
          type: "customer",
          label: "Customer",
          description:
            "A person or organization that buys goods or services from a store or business.",
        },
        {
          id: 2,
          type: "seller",
          label: "Seller",
          description: "A person who sells something.",
        },
        {
          id: 3,
          type: "admin",
          label: "Admin",
          description: "The administration of a business, organization, etc.",
        },
      ]);
    });
};
