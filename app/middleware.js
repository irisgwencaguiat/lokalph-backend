const httpResource = require("./http_resource");

const middleware = {
  authentication: {
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
