const model = require('../models/index');

async function postUserController(req, res, next) {
  const { username, password } = req.body;

  try {
    const checkUsername = await model.User.findOne({
      where: {
        username,
      },
    });

    if (checkUsername) {
      const error = new Error('Username already exists');
      error.statusCode = 400;
      throw error;
    }

    const { id } = await model.User.create({ username, password });
    res.status(201);
    res.json({
      data: {
        id,
        username,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function putUserByIdController(req, res, next) {
  const { username, oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // TODO: check user menggunakan id
    const user = await model.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      const error = new Error('User is not found');
      error.statusCode = 404;
      throw error;
    }

    // TODO: check oldPassword apakah sama dengan password di DB
    const resultVerifyPass = user.verifyPassword(oldPassword);

    if (!resultVerifyPass) {
      const error = new Error('Password is wrong');
      error.statusCode = 403;
      throw error;
    }

    // TODO: update user
    user.username = username;
    user.password = newPassword;
    const userDataUpdated = await user.save();

    res.status(200);
    res.json({
      data: {
        id: userDataUpdated.id,
        username: userDataUpdated.username,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getUsersController(req, res, next) {
  try {
    const users = await model.User.findAll({
      attributes: ['id', 'username'],
    });
    res.status(200);
    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postUserController,
  putUserByIdController,
  getUsersController,
};
