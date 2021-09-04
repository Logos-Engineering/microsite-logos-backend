const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { AuthenticationError } = require('../middlewares/error');

// membuat garam untuk campuran password
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

// untuk memverifikasi refresh token yang dikirim
async function verifyRefToken(model, refreshToken) {
  // periksa refresh token di dlm DB
  const checkRefTokenInDB = await model.Authentication.findOne({
    where: {
      refreshToken,
    },
  });

  if (!checkRefTokenInDB) {
    const error = new AuthenticationError('Unauthorized');
    throw error;
  }

  // verifikasi refresh token berdasarkan key
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    async (err, decode) => {
      if (err) {
        if (err.name !== 'TokenExpiredError') {
          const error = new AuthenticationError(err.message);
          throw error;
        }
        const error = new AuthenticationError('Refresh token has Expired');
        // jika refresh token expired maka refresh token yang di DB dihapus
        await model.Authentication.destroy({
          where: {
            refreshToken,
          },
        });
        throw error;
      }

      // verifikasi user
      const user = await model.User.findByPk(decode.id);

      if (!user) {
        const error = new AuthenticationError('Unauthorized');
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
