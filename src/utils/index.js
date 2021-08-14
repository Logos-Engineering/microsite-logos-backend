const crypto = require('crypto');

const generateSalt = () => crypto.randomBytes(16).toString('base64');

const encryptPassword = (plainTextPass, salt) => crypto
  .createHash('RSA-SHA256')
  .update(plainTextPass)
  .update(salt)
  .digest('hex');

module.exports = { generateSalt, encryptPassword };
