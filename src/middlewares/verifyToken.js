const jwt = require('jsonwebtoken');

const model = require('../models/index');
const { AuthenticationError } = require('./error');

// fungsi untuk verifikasi access token
async function verifyAccToken(req, res, next) {
  const headerAuth = req.headers.authorization;

  try {
    if (headerAuth) {
      const splitHeader = headerAuth.split(' ');
      const bearer = splitHeader[0];
      const token = splitHeader[1];

      if (bearer !== 'Bearer') {
        const error = new AuthenticationError('Unauthorized');
        throw error;
      }

      // titik verifikasi access token
      await jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, decode) => {
        if (err) {
          if (err.name !== 'TokenExpiredError') {
            const error = new AuthenticationError(err.message);
            throw error;
          }
          const error = new AuthenticationError('Access token has Expired');
          throw error;
        }

        // verifikasi user
        const user = await model.User.findByPk(decode.id);

        if (!user) {
          const error = new AuthenticationError('Unauthorized');
          throw error;
        }
        // kembalikan data user
        req.user = user;
        next();
      });
    } else {
      const error = new AuthenticationError('Unauthorized');
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { verifyAccToken };
