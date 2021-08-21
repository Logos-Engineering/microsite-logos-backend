require('dotenv').config();

const { NODE_ENV, NAME_DB_DEV, NAME_DB_PROD } = process.env;

module.exports = {
  HOST: process.env.HOST_DB,
  PORT: process.env.PORT_DB,
  USER: process.env.USER_DB,
  PASSWORD: process.env.PASS_DB,
  DB: NODE_ENV === 'prod' ? NAME_DB_PROD : NAME_DB_DEV,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
