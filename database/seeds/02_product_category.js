exports.seed = function (knex) {
  const categories = [
    {
      id: 1,
      name: "mobile-phones-tablets",
      label: "Mobile Phones & Tablets",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934494/lokal-ph-development/product-categories/mobile-phones-tablets_ykm1ag.png",
    },

    {
      id: 2,
      name: "women-fashion",
      label: "Women's Fashion",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934147/lokal-ph-development/product-categories/women_s-fashion_n3hrxd.png",
    },

    {
      id: 3,
      name: "men-fashion",
      label: "Men's Fashion",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/men_s-fashion_qaf0mu.png",
    },

    {
      id: 4,
      name: "health-beauty",
      label: "Health & Beauty",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/health-beauty_za3kph.png",
    },

    {
      id: 5,
      name: "food-drinks",
      label: "Food & Drinks",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934145/lokal-ph-development/product-categories/food-drinks_aurkad.png",
    },

    {
      id: 6,
      name: "video-gaming",
      label: "Video Gaming",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/video-gaming_mcw5hf.png",
    },
  ];
  return knex("product_category")
    .del()
    .then(function () {
      return knex("product_category").insert(categories);
    });
};
