const jwt = require('jsonwebtoken');

const { User, Authentication } = require('../models/index');
const { AuthenticationError, AuthorizationError, NotFoundError } = require('../middlewares/error');

// untuk memverifikasi refresh token yang dikirim
async function verifyRefToken(refreshToken) {
  // periksa refresh token di dlm DB
  const checkRefTokenInDB = await Authentication.findOne({
    where: {
      refreshToken,
    },
  });

  if (!checkRefTokenInDB) {
    const error = new AuthenticationError('Unauthorized');
    return Promise.reject(error);
  }

  // verifikasi refresh token berdasarkan key
  return jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_KEY,
    async (err, decode) => {
      if (err) {
        if (err.name !== 'TokenExpiredError') {
          const error = new AuthenticationError(err.message);
          return Promise.reject(error);
        }
        const error = new AuthenticationError('Refresh token has Expired');
        // jika refresh token expired maka refresh token yang di DB dihapus
        await Authentication.destroy({
          where: {
            refreshToken,
          },
        });
        return Promise.reject(error);
      }

      // verifikasi user
      const user = await User.findByPk(decode.id);

      if (!user) {
        const error = new AuthenticationError('Unauthorized');
        return Promise.reject(error);
      }
      return user;
    },
  );
}

async function isUserExist(username, password) {
  const user = await User.findOne({
    where: {
      username,
    },
  });
  if (!user) {
    const error = new NotFoundError('User is not found');
    return Promise.reject(error);
  }

  if (!user.verifyPassword(password)) {
    const error = new AuthorizationError('Incorrect password');
    return Promise.reject(error);
  }

  return Promise.resolve(user);
}

async function generateToken({ username, password }) {
  const user = await isUserExist(username, password);
  if (user instanceof NotFoundError || user instanceof AuthorizationError) {
    return Promise.reject(user);
  }

  const generateAccessToken = jwt.sign({
    id: user.id,
    role: user.role,
  }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.JWT_ACC_TOKEN_EXP,
  });

  const generateRefreshToken = jwt.sign({
    id: user.id,
    role: user.role,
  }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: process.env.JWT_REF_TOKEN_EXP,
  });

  await Authentication.create({
    refreshToken: generateRefreshToken,
  });

  return Promise.resolve({
    accessToken: generateAccessToken,
    refreshToken: generateRefreshToken,
  });
}

async function updateToken(refreshToken) {
  const user = await verifyRefToken(refreshToken);
  if (user instanceof AuthenticationError || user instanceof AuthorizationError) {
    return Promise.reject(user);
  }
  const generateAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.JWT_ACC_TOKEN_EXP,
  });
  return { accessToken: generateAccessToken };
}

async function deleteToken(refreshToken) {
  const result = await Authentication.destroy({
    where: {
      refreshToken,
    },
  });

  if (!result) {
    const error = new AuthenticationError('Unauthorized');
    return Promise.reject(error);
  }
}

module.exports = { generateToken, updateToken, deleteToken };
