require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const apiRoute = require('./routes/index');
const db = require('./models/index');

const app = express();

// DB connection
(async function () {
  try {

    await db.sequelize.sync({ force: true });

    // await db.sequelize.sync();
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
    
    const user = await db.User.create({
        username: 'user test',
        password: 'slslwww'
    });
    
  } catch (error) {
    console.error(error);
  }
})();

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
// parse application/json
app.use(express.json());

// Route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello'
  })
});

app.use('/api', apiRoute);

module.exports = app;