const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const keys = require('../config/keys');
const User = mongoose.model('users');

module.exports = (app) => {
  app.post('/api/register', (req, res) => {
    User.findOne({ email: req.body.email.toLowerCase() }).then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }

      const token = crypto.randomBytes(20);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, null, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(async (user) => {
              const payload = {
                id: user.id,
                name: req.body.name,
              };

              await jwt.sign(
                payload,
                keys.jwtSecretKey,
                {
                  expiresIn: 31556926, // 1 year in seconds
                },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token,
                    name: payload.name,
                    id: payload.id,
                  });
                },
              );
            })
            .catch((err) => console.log(err));
        });
      });
    });
  });
};
