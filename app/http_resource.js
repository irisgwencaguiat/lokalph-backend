const httpResource = ({ success, code, message, data }) => {
  let errorMessage = message;
  if (typeof message === "object") errorMessage = "Server error.";
  return {
    success,
    code,
    success_message: success ? message : null,
    data: success ? data : null,
    error: !success,
    error_message: !success ? errorMessage : null,
  };
};

module.exports = httpResource;
