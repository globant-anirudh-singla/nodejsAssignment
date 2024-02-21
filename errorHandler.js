const apiError = require("./error/apiError");
const customError = require("./error/customError");

const errorHandler = (error, req, res, next) => {
  // Set default status code and error code if not provided
  const statusCode = error.statusCode || 500;

  // Send the error response
  if (error instanceof customError) {
    return res.status(statusCode).send({
      message: error.message,
    });
  }
  
  if (error instanceof apiError) {
    return res.status(400).send({
      message: error.message,
    });
  }
  
  return res.status(statusCode).send({
    message: 'something went wrong',
  });
};

module.exports = errorHandler;
