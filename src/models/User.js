const { generateSalt, encryptPassword } = require('../utils/index');

module.exports = function (sequelize, Sequelize) {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return this.getDataValue('password');
      },
    },
    salt: { // unique encryption key
      type: Sequelize.STRING,
      get() {
        return this.getDataValue('salt');
      },
    },
    role: {
      type: Sequelize.STRING,
      get() {
        return this.getDataValue('role');
      },
    },
  });

  const setSaltAndPassword = (user) => {
    if (user.changed('password')) {
      user.salt = generateSalt();
      user.password = encryptPassword(user.password, user.salt);
    }
  };

  // Hooks
  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  // mengemballikan true jika inputPassword = password di dalam DB
  User.prototype.verifyPassword = function(inputPassword) {
    return encryptPassword(inputPassword, this.salt) === this.password;
  };

  return User;
};
