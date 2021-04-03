const bcrypt = require("bcryptjs");
const slugify = require("slugify");

const utilityController = {
  isObjectEmpty: (object) => {
    for (let property in object) {
      if (object.hasOwnProperty(property)) {
        return false;
      }
    }

    return true;
  },
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    return bcrypt.hashSync(password, salt);
  },
  validateHashPassword(plainTextPassword, hashedPassword) {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  },
  slugify(word) {
    return slugify(word, {
      lower: true,
      replacement: "-",
      remove: undefined,
      strict: true,
    });
  },
  generateRandomCode() {
    return Math.random().toString(20).substr(2, 5);
  },
};

module.exports = utilityController;
