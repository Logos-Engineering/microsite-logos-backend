function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  const isProdOrTest = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'test';

  // Response for dev mode
  if(!isProdOrTest) {
    return res.json({
      error: {
        message: err.message,
        stack: err.stack
      }
    });
  }

  return res.json({
    error: {
      message: err.message,
    }
  });
}

module.exports = {
  notFound,
  errorHandler
};
