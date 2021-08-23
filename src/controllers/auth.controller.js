const jwt = require('jsonwebtoken');

const model = require('../models/index');
const { verifyRefToken } = require('../utils/index');

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
      const error = new Error('Incorrect password');
      error.statusCode = 403;
      throw error;
    }

    const generateAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.JWT_ACC_TOKEN_EXP,
    });

    const generateRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_KEY, {
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

async function deleteAuthController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await model.Authentication.destroy({
      where: {
        refreshToken,
      },
    });

    if (!result) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
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
