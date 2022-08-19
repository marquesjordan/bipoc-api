const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const e = require('cors');
const User = mongoose.model('users');
const Profile = mongoose.model('profile');
const Company = mongoose.model('company');
const Social = mongoose.model('social');
const Location = mongoose.model('location');

module.exports = (app) => {
  app.post('/api/verify', async (req, res) => {
    try {
      const decoded = jwt.verify(req.body.token, keys.jwtSecretKey);

      if (decoded.user_id) {
        return res.status(200).send(req.body.token);
      } else {
        res.status(400).send('Invalid token');
      }
    } catch (err) {
      res.status(400).send('Token Expired');
    }
  });

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

      const userSocial = await Social.create({});
      const userLocation = await Location.create({});

      // Create user in our database
      const user = await User.create({
        name: name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedUserPassword,
      });

      const profile = await Profile.create({
        _user: user._id,
        _social: userSocial._id,
        _location: userLocation._id,
        fullName: name,
        email: email,
      });

      // Set if Registering as Poster (Not regular user)
      if (false) {
        // If company, set profile.type and then exe below:

        const company = await Company.create({});
        const companySocial = await Social.create({});
        const companyLocation = await Location.create({});
      }

      // Create token
      const token = jwt.sign({ user_id: user._id, email }, keys.jwtSecretKey, {
        expiresIn: '5h',
      });

      res.status(201).json({ user, profile, token });
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
