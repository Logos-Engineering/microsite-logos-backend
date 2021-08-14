const { generateSalt, encryptPassword } = require('../utils/index');

module.exports = function (sequelizeInstance, Sequelize) {
  const User = sequelizeInstance.define('user', {
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

  // return true if input password encrypted is equal with the password that is saved on DB
  User.prototype.verifyPassword = function (inputPassword) {
    return encryptPassword(inputPassword, this.salt) === this.password;
  };

  return User;
};
