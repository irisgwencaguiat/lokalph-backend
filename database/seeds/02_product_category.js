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

    {
      id: 7,
      name: "home-furniture",
      label: "Home & Furniture",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/home-furniture_azkded.png",
    },

    {
      id: 8,
      name: "sports",
      label: "Sports",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/sports_pveyim.png",
    },

    {
      id: 9,
      name: "gardening",
      label: "Gardening",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934145/lokal-ph-development/product-categories/gardening_pl7uwk.png",
    },

    {
      id: 10,
      name: "babies-kids",
      label: "Babies & Kids",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934147/lokal-ph-development/product-categories/babies-kids_uoesry.png",
    },

    {
      id: 11,
      name: "electronics",
      label: "Electronics",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934145/lokal-ph-development/product-categories/electronics_kdgel4.png",
    },

    {
      id: 12,
      name: "motorbikes",
      label: "Motorbikes",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/motorbikes_edoaut.png",
    },

    {
      id: 13,
      name: "cars",
      label: "Cars",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934145/lokal-ph-development/product-categories/cars_okpr9p.png",
    },

    {
      id: 14,
      name: "luxury",
      label: "Luxury",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934145/lokal-ph-development/product-categories/luxury_nbseb9.png",
    },

    {
      id: 15,
      name: "music-media",
      label: "Music & Media",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/music-media_r9o9jw.png",
    },

    {
      id: 16,
      name: "toys-games",
      label: "Toys & Games",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/toy-games_fkdxqo.png",
    },

    {
      id: 17,
      name: "design-craft",
      label: "Design & Craft",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934145/lokal-ph-development/product-categories/design-craft_scxtad.png",
    },

    {
      id: 18,
      name: "antiques",
      label: "Antiques",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934147/lokal-ph-development/product-categories/antiques_worew9.png",
    },

    {
      id: 19,
      name: "books",
      label: "Books",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934533/lokal-ph-development/product-categories/books_oxwx9f.png",
    },

    {
      id: 20,
      name: "photography",
      label: "Photography",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934146/lokal-ph-development/product-categories/photography_wizg5c.png",
    },

    {
      id: 21,
      name: "construction-industrial",
      label: "Construction & Industrial",
      image_url:
        "https://res.cloudinary.com/deqllunb9/image/upload/v1614934145/lokal-ph-development/product-categories/construction-industrial_gav7ge.png",
    },
  ];
  return knex("product_category")
    .del()
    .then(function () {
      return knex("product_category").insert(categories);
    });
};
