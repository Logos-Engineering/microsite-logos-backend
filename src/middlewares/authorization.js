async function authorizationUser(req, res, next) {
  try {
    if (req.user.role !== 'superadmin') {
      const error = new Error('You do not have permission to access this resource');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorizationUser;
