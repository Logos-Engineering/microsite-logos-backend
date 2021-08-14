require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const apiRoute = require('./routes/index');
const model = require('./models/index');
const middlewaresError = require('./middlewares/error');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  // koneksi db
  (async function () {
    try {
      if (process.env.NODE_ENV === 'prod') {
        await model.sequelize.sync();
      } else {
        await model.sequelize.sync({ force: true });
      }
      await model.sequelize.authenticate();
      console.log('Connection has been established successfully.');

      await model.User.create({
        username: 'user test',
        password: 'slslwww',
      });
    } catch (error) {
      console.error(error);
    }
  }());
}

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
// parse application/json
app.use(express.json());

// Route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello',
  });
});
app.use('/api', apiRoute);

// Global Error Handler
app.use(middlewaresError.notFound);
app.use(middlewaresError.errorHandler);

module.exports = app;
