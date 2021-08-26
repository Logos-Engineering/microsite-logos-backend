module.exports = function(sequelize, Sequelize) {
  const Category = sequelize.define('Category', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Category;
};
