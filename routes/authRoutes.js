const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const User = mongoose.model('users');

module.exports = (app) => {
  app.post('/api/register', async (req, res) => {
    try {
      // Get user input
      const { name, email, password } = req.body;

      // Validate user input
      if (!(email && password && name)) {
        res.status(400).send('All input is required');
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send('User Already Exist. Please Login');
      }

      //Encrypt user password
      encryptedUserPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await User.create({
        name: name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedUserPassword,
      });

      console.log(user);

      // Create token
      const token = jwt.sign({ user_id: user._id, email }, keys.jwtSecretKey, {
        expiresIn: '5h',
      });
      // save user token
      //  user.token = token;

      // return new user
      res.status(201).json({ user, token });
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res.status(400).send('All input is required');
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          keys.jwtSecretKey,
          {
            expiresIn: '5h',
          },
        );

        return res.status(200).json({ user, token });
      }
      return res.status(400).send('Invalid Credentials');
    } catch (err) {
      console.log(err);
    }
  });
};
