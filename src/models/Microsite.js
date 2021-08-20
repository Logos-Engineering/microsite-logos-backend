module.exports = (sequelize, Sequelize) => (
  sequelize.define('Microsite', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    publish: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  })
);
