const httpResource = require("./http_resource");
const passport = require("passport");

const middleware = {
  authentication: {
    passportAuthenticate: (request, response, next) => {
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

    grantAccess: (roles) => {
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
};

module.exports = middleware;
