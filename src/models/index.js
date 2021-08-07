const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelizeInstance = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    logging: false,
    options: {
      port: dbConfig.PORT
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

let model = {
  Sequelize,
  sequelize: sequelizeInstance
};

model.Microsite = require('./Microsite')(sequelizeInstance, Sequelize);
model.Category = require('./Category')(sequelizeInstance, Sequelize);
model.Webinar = require('./Webinar')(sequelizeInstance, Sequelize);
model.User = require('./User')(sequelizeInstance, Sequelize);

model.Category.hasMany(model.Microsite);
model.Microsite.belongsTo(model.Category);
model.Webinar.hasMany(model.Microsite, { allowNull: true });
model.Microsite.belongsTo(model.Webinar);

module.exports = model;
