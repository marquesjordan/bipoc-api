const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const keys = require('./config/keys');

require('./models/User');

const PORT = process.env.PORT || 5000;

const User = mongoose.model('users');

mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

mongoose.connection.on('error', (err) => {
  console.log(err);
});

const app = express();

app.use(function (req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'http') {
    res.redirect('https://bipoc-web.vercel.app' + req.url);
  } else {
    return next();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  }),
);
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
require('./routes/authRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
}); //in case server and client run on different urls.

io.on('connection', (socket) => {
  console.log('client connected: ', socket.id);

  socket.join('clock-room');

  socket.on('disconnect', (reason) => {
    console.log(reason);
  });
});

setInterval(() => {
  io.to('clock-room').emit('time', new Date());
}, 1000);

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log('Server running on Port: ', PORT);
});
