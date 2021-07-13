require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const apiRoute = require('./routes/index');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello'
  })
});

app.use('/api', apiRoute);

module.exports = app;