module.exports = function (sequelizeInstance, Sequelize) {
  return sequelizeInstance.define('Category', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  });

};