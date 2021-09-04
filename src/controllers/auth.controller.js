const jwt = require('jsonwebtoken');

const model = require('../models/index');
const { verifyRefToken } = require('../utils/index');
const { AuthenticationError, AuthorizationError } = require('../middlewares/error');

// controller untuk login user
async function postAuthController(req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await model.User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      const error = new Error('User is not found');
      error.statusCode = 404;
      throw error;
    }

    if (!user.verifyPassword(password)) {
      const error = new AuthorizationError('Incorrect password');
      throw error;
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

    await model.Authentication.create({
      refreshToken: generateRefreshToken,
    });

    res.status(201);
    res.json({
      data: {
        accessToken: generateAccessToken,
        refreshToken: generateRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// controller untuk memperbarui access token
async function putAuthController(req, res, next) {
  const { refreshToken } = req.body;

  try {
    const user = await verifyRefToken(model, refreshToken);

    const generateAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.JWT_ACC_TOKEN_EXP,
    });

    res.status(200);
    res.json({
      data: {
        accessToken: generateAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// controller untuk logout
async function deleteAuthController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await model.Authentication.destroy({
      where: {
        refreshToken,
      },
    });

    if (!result) {
      const error = new AuthenticationError('Unauthorized');
      throw error;
    }

    res.status(200);
    res.json({
      data: {
        message: 'Successfully logged out',
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postAuthController,
  putAuthController,
  deleteAuthController,
};
