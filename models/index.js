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

let db = {
  Sequelize,
  sequelize: sequelizeInstance
};

db.Microsite = require('./Microsite')(sequelizeInstance, Sequelize);
db.Category = require('./Category')(sequelizeInstance, Sequelize);
db.Webinar = require('./Webinar')(sequelizeInstance, Sequelize);
db.User = require('./User')(sequelizeInstance, Sequelize);

db.Category.hasMany(db.Microsite);
db.Microsite.belongsTo(db.Category);
db.Webinar.hasMany(db.Microsite, { allowNull: true });
db.Microsite.belongsTo(db.Webinar);

module.exports = db;
