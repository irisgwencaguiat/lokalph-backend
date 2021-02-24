require("dotenv").config();

const options = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    migrations: {
      directory: __dirname + "/database/migrations",
    },
    seeds: {
      directory: __dirname + "/database/seeds",
    },
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: true,
    },
    migrations: {
      directory: __dirname + "/database/migrations",
    },
    seeds: {
      directory: __dirname + "/database/production/seeds",
    },
  },
};

module.exports = options;
