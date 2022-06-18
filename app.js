require('dotenv').config();
require('./config/database').connect();
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('./config/keys');
const cors = require('cors');
const auth = require('./middleware/auth');
const bodyParser = require('body-parser');
const app = express();

require('./models/User');

const User = mongoose.model('users');

app.use(express.json({ limit: '50mb' }));
// app.use(express.static(path.join(__dirname, 'public')));
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
app.use(allowCrossDomain);

app.use(cors());
app.options('*', cors()); // enable pre-flight
app.use(bodyParser.json());

require('./routes/authRoutes')(app);

app.get('/api/welcome', auth, (req, res) => {
  res.status(200).send('Welcome to FreeCodeCamp 🙌');
});

// This should be the last route else any after it won't work
app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: 'You reached a route that is not defined on this server',
    },
  });
});

module.exports = app;
