require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const api = require("./api");
const jwtPassport = require("./passport");

const application = express();
application.use(cors());
application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());
application.use("/api", api);
application.use(passport.initialize());
jwtPassport(passport);

const PORT = process.env.PORT || 3000;

application.listen(PORT, () =>
  console.log(`Server is running at PORT:${PORT}`)
);
