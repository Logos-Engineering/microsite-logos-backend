const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

function Model() {
  this._sequelize = new Sequelize(
    dbConfig.URI,
    {
      dialect: dbConfig.dialect,
      operatorsAliases: false,
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
      },
    },
  );

  this.Microsite = require('./Microsite')(this._sequelize, Sequelize);
  this.Category = require('./Category')(this._sequelize, Sequelize);
  this.Webinar = require('./Webinar')(this._sequelize, Sequelize);
  this.User = require('./User')(this._sequelize, Sequelize);
  this.Authentication = require('./Authentications')(this._sequelize, Sequelize);

  this.init = function () {
    return this._sequelize.sync();
  };

  this.initForce = function () {
    return this._sequelize.sync({ force: true });
  };
}

module.exports = (() => {
  const model = new Model();
  model.Category.hasMany(model.Microsite);
  model.Microsite.belongsTo(model.Category);
  model.Webinar.hasMany(model.Microsite, { allowNull: true });
  model.Microsite.belongsTo(model.Webinar);
  return model;
})();
