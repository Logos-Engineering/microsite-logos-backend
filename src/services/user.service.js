const { User } = require('../models/index');
const { ClientErrors, NotFoundError, AuthorizationError } = require('../middlewares/error');

function getUserBy(obj) {
  return User.findOne({
    where: obj,
  });
}

async function addUser(username, password, role) {
  // periksa username, apakah sudah digunakan?
  const isUserExist = await getUserBy({ username });

  if (isUserExist) {
    const error = new ClientErrors('The username already exists');
    error.statusCode = 409;
    throw error;
  }
  return User.create({ username, password, role });
}

function getAllUsers() {
  return User.findAll({
    attributes: ['id', 'username', 'role'],
  });
}

async function updateUserById(id, username, oldPassword, newPassword) {
  const user = await getUserBy({ id });
  if (!user) {
    const error = new NotFoundError('The user is not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user) {
    const error = new NotFoundError('The user is not found');
    error.statusCode = 404;
    throw error;
  }

  // verifikasi password
  const resultVerifyPass = user.verifyPassword(oldPassword);

  if (!resultVerifyPass) {
    const error = new AuthorizationError('Incorrect password');
    throw error;
  }

  // perbarui data user
  user.username = username;
  user.password = newPassword;
  return user.save();
}

async function deleteUserById(id) {
  // hapus data user berdasarkan id
  const user = await User.destroy({
    where: {
      id,
    },
  });

  // jika data user tdk ada maka kembalikan error
  if (!user) {
    const error = new NotFoundError('The user is not found');
    throw error;
  }
}

module.exports = {
  addUser,
  getUserBy,
  getAllUsers,
  updateUserById,
  deleteUserById,
};
