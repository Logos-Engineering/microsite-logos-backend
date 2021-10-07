const {
  addUser,
  getAllUsers,
  updateUserById,
  deleteUserById,
} = require('../services/user.service');

async function postUserController(req, res, next) {
  const { username, password, role = 'admin' } = req.body;
  try {
    const { id } = await addUser(username, password, role);
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
    const users = await getAllUsers();
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
  const { id } = req.params;
  try {
    const user = await updateUserById(id, username, oldPassword, newPassword);
    res.status(200);
    res.json({
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUserByIdController(req, res, next) {
  const { id } = req.params;
  try {
    await deleteUserById(id);
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
