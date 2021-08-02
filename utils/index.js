const crypto = require('crypto');

const generateSalt = () => {
  return crypto.randomBytes(16).toString('base64')
}

const encryptPassword = (plainTextPass, salt) => {
  return crypto
  .createHash('RSA-SHA256')
  .update(plainTextPass)
  .update(salt)
  .digest('hex');
}

module.exports = { generateSalt, encryptPassword };