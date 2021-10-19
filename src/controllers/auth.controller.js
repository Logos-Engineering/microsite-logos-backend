const { generateToken, updateToken, deleteToken } = require('../services/auth.service');

// controller untuk login user
async function postAuthController(req, res, next) {
  const { username, password } = req.body;

  try {
    const { accessToken, refreshToken } = await generateToken({ username, password });
    res.status(201);
    res.json({
      data: {
        accessToken,
        refreshToken,
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
    const { accessToken } = await updateToken(refreshToken);
    res.status(200);
    res.json({
      data: {
        accessToken,
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
    await deleteToken(refreshToken);
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
