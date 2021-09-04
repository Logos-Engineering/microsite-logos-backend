module.exports = (sequelize, Sequelize) => (
  sequelize.define('Authentication', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    refreshToken: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })
);
