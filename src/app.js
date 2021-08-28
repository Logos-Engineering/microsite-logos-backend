require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const apiRoute = require('./routes/index');
const model = require('./models/index');
const errorMiddleware = require('./middlewares/error');
const uploadMiddleware = require('./middlewares/uploadImage');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  // koneksi ke db
  (async () => {
    try {
      if (process.env.NODE_ENV === 'prod') {
        await model.init();
      } else {
        await model.initForce();
      }
      process.stdout.write(`Connection has been established successfully.\n`);

      await model.User.create({
        username: process.env.USER_ROOT,
        password: process.env.PASS,
        role: process.env.ROLE,
      });
    } catch (error) {
      process.stdout.write(error);
    }
  })();
}

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
// parse untuk application/json
app.use(express.json());

// Set folder public menjadi static-file
app.use('/public', express.static(`${process.cwd()}/public`));

app.use(uploadMiddleware);

// Route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello',
  });
});
app.use('/api', apiRoute);

// Global Error Handler
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

module.exports = app;
