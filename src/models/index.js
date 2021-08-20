const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    logging: false,
    options: {
      port: dbConfig.PORT,
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  },
);

const model = {
  Sequelize,
  sequelize,
};

model.Microsite = require('./Microsite')(sequelize, Sequelize);
model.Category = require('./Category')(sequelize, Sequelize);
model.Webinar = require('./Webinar')(sequelize, Sequelize);
model.User = require('./User')(sequelize, Sequelize);

model.Category.hasMany(model.Microsite);
model.Microsite.belongsTo(model.Category);
model.Webinar.hasMany(model.Microsite, { allowNull: true });
model.Microsite.belongsTo(model.Webinar);

module.exports = model;
