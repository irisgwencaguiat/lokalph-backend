const bcrypt = require("bcryptjs");

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
};

module.exports = utilityController;
