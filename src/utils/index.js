const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function generateSalt() {
  return crypto.randomBytes(16).toString('base64');
}

function encryptPassword(plainTextPass, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainTextPass)
    .update(salt)
    .digest('hex');
}

async function verifyRefToken(model, refreshToken) {
  const checkRefTokenInDB = await model.Authentication.findOne({
    where: {
      refreshToken,
    },
  });

  if (!checkRefTokenInDB) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    throw error;
  }

  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    async (err, decode) => {
      if (err) {
        if (err.name !== 'TokenExpiredError') {
          const error = new Error(err.message);
          error.statusCode = 403;
          throw error;
        }
        const error = new Error('Refresh token has Expired');
        await model.Authentication.destroy({
          where: {
            refreshToken,
          },
        });
        error.statusCode = 401;
        throw error;
      }

      const user = await model.User.findByPk(decode.id);

      if (!user) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
      }
      return user;
    },
  );
}

module.exports = {
  generateSalt,
  encryptPassword,
  verifyRefToken,
};
