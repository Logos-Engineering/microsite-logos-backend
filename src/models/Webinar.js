module.exports = (sequelize, Sequelize) => (
  sequelize.define('Webinar', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    summary: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })
);
