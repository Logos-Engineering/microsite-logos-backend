const jwt = require('jsonwebtoken');

const model = require('../models/index');

async function verifyAccToken(req, res, next) {
  const headerAuth = req.headers.authorization;

  try {
    if (headerAuth) {
      const splitHeader = headerAuth.split(' ');
      const bearer = splitHeader[0];
      const token = splitHeader[1];

      if (bearer !== 'Bearer') {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
      }

      await jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, decode) => {
        if (err) {
          if (err.name !== 'TokenExpiredError') {
            const error = new Error(err.message);
            error.statusCode = 403;
            throw error;
          }
          const error = new Error('Access token has Expired');
          error.statusCode = 401;
          throw error;
        }

        const user = await model.User.findByPk(decode.id);

        if (!user) {
          const error = new Error('Unauthorized');
          error.statusCode = 401;
          throw error;
        }

        req.user = user;
        next();
      });
    } else {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { verifyAccToken };
