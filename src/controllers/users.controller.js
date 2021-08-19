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

async function getUsersController(req, res, next) {
  try {
    const users = await model.User.findAll({
      attributes: ['id', 'username'],
    });
    res.status(200);
    res.json({
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postUserController,
  getUsersController,
};
