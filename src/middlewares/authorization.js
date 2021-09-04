const { AuthorizationError } = require('./error');

async function authorizationUser(req, res, next) {
  try {
    if (req.user.role !== 'superadmin') {
      const error = new AuthorizationError('You do not have permission to access this resource');
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorizationUser;
