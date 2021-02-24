const httpResource = ({ success, code, message, data }) => ({
  success,
  code,
  success_message: success ? message : null,
  data: success ? data : null,
  error: !success,
  error_message: !success ? message : null,
});

module.exports = httpResource;
