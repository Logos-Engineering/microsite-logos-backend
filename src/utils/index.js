const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { AuthenticationError } = require('../middlewares/error');

// membuat garam untuk campuran password
function generateSalt() {
  return crypto.randomBytes(16).toString('base64');
}

function encryptPassword(plainTextPass, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainTextPass)
    .update(salt)
    .digest('hex');
}

module.exports = {
  generateSalt,
  encryptPassword,
};
