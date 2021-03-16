const httpResource = require("./http_resource");
const passport = require("passport");
const Multer = require("multer");
const { diskStorage } = Multer;
const fs = require("fs-extra");

const middleware = {
  authentication: {
    passportAuthenticate(request, response, next) {
      passport.authenticate("jwt", { session: false }, (error, user) => {
        if (error)
          return response.status(401).json(
            httpResource({
              success: false,
              code: 401,
              message: "You are not authorized to access this route.",
            })
          );
        if (!user)
          return response.status(401).json(
            httpResource({
              success: false,
              code: 401,
              message: "You are not authorized to access this route.",
            })
          );
        request.user = user;
        next();
      })(request, response, next);
    },

    grantAccess(roles) {
      return async (request, response, next) => {
        const { type } = request.user.account_type;
        if (!roles.includes(type))
          return response.status(401).json(
            httpResource({
              success: false,
              code: 401,
              message: "You are not authorized to access this route.",
            })
          );
        next();
      };
    },
  },
  multer() {
    return Multer({
      storage: diskStorage({
        destination(request, file, callback) {
          const directory = process.cwd() + "/tmp/files";
          fs.ensureDirSync(directory);
          callback(null, directory);
        },
      }),
    });
  },
};

module.exports = middleware;
