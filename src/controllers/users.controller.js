const model = require('../models/index');

async function postUserController(req, res, next) {
  let { username, password, role = 'admin' } = req.body;
  role = 'admin';
  try {
    // periksa username, apakah sudah digunakan?
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

    // simpan data user ke DB
    const { id } = await model.User.create({ username, password, role });
    res.status(201);
    res.json({
      data: {
        id,
        username,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getUsersController(req, res, next) {
  try {
    // dapatkan semua data user kembalikan properti id dan username nya saja
    const users = await model.User.findAll({
      attributes: ['id', 'username', 'role'],
    });
    res.status(200);
    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

async function putUserByIdController(req, res, next) {
  const { username, oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // periksa data user berdasarkan id
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

    // verifikasi password
    const resultVerifyPass = user.verifyPassword(oldPassword);

    if (!resultVerifyPass) {
      const error = new Error('Password is wrong');
      error.statusCode = 403;
      throw error;
    }

    // perbarui data user
    user.username = username;
    user.password = newPassword;
    const userDataUpdated = await user.save();

    res.status(200);
    res.json({
      data: {
        id: userDataUpdated.id,
        username: userDataUpdated.username,
        role: userDataUpdated.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUserByIdController(req, res, next) {
  const { id: userId } = req.params;
  try {
    // hapus data user berdasarkan id
    const result = await model.User.destroy({
      where: {
        id: userId,
      },
    });

    // jika data user tdk ada maka kembalikan error
    if (!result) {
      const error = new Error('User is not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: 'Success deleted user' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postUserController,
  getUsersController,
  putUserByIdController,
  deleteUserByIdController,
};
