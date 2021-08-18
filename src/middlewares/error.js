function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function ClientErrors(messages, statusCode = 400) {
  this.messages = messages;
  this.statusCode = statusCode;
  this.name = 'ClientErrors';
  this.stack = (new Error()).stack;
}

function errorHandler(err, req, res, next) {
  if (err.name === 'ClientErrors') {
    process.stdout.write(`${err.stack}\n`);
    res.status(err.statusCode);
    return res.json({
      error: {
        messages: err.messages,
      },
    });
  }

  process.stdout.write(`${err.stack}\n`);

  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode);

  return res.json({
    error: {
      message: err.message || 'Internal server error',
    },
  });
}

module.exports = {
  notFound,
  errorHandler,
  ClientErrors,
};
