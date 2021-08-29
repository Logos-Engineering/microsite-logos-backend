function ClientErrors(messages, statusCode = 400) {
  this.messages = messages;
  this.statusCode = statusCode;
  this.name = 'ClientErrors';
  this.stack = (new Error()).stack;
}

function NotFoundError(message = 'The resource is not found', statusCode = 404) {
  this.message = message;
  this.statusCode = statusCode;
  this.name = 'NotFoundError';
  this.stack = (new Error()).stack;
}

function AuthenticationError(message, statusCode = 401) {
  this.message = message;
  this.statusCode = statusCode;
  this.name = 'AuthenticationError';
  this.stack = (new Error()).stack;
}

function AuthorizationError(message, statusCode = 403) {
  this.message = message;
  this.statusCode = statusCode;
  this.name = 'AuthorizationError';
  this.stack = (new Error()).stack;
}

function notFound(req, res, next) {
  const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  if (err.name === 'ClientErrors') {
    res.status(err.statusCode);
    return res.json({
      error: {
        messages: err.messages,
      },
    });
  }

  if (
    err.name === 'NotFoundError'
    || err.name === 'AuthenticationError'
    || err.name === 'AuthorizationError'
  ) {
    res.status(err.statusCode);
    return res.json({
      error: {
        message: err.message,
      },
    });
  }

  process.stdout.write(`${err.stack}\n`);

  res.status(500);

  return res.json({
    error: {
      message: 'Internal server error',
    },
  });
}

module.exports = {
  notFound,
  errorHandler,
  ClientErrors,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
};
