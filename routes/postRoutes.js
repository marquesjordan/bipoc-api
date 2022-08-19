const _ = require('lodash');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const Profile = mongoose.model('profile');
const Company = mongoose.model('company');
const Social = mongoose.model('social');
const Location = mongoose.model('location');
const auth = require('../middleware/auth');
const fs = require('fs');
const util = require('util');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
  app.post('/api/post', auth, async (req, res, next) => {
    try {
      const { title, summary, youtubeUrl, category, tags, imageKey } = req.body;

      const newPost = await Post.create({
        postedBy: req.user.user_id,
        title,
        summary,
        youtubeUrl,
        category,
        tags,
        imageKey,
      });

      return res.status(200).send({ post: newPost });
    } catch (err) {
      console.log(err);
      return res.status(400).send('Post Error');
    }
  });

  app.get('/api/posts', auth, async (req, res, next) => {
    const posts = await Post.find({});
    return res.status(200).send({ posts: posts });
  });

  app.get('/api/profile', auth, async (req, res) => {
    const decoded = jwt.verify(req.headers.authorization, keys.jwtSecretKey);

    if (decoded.user_id) {
      // return res.status(200).send(req.body.token);
      let profile = await Profile.find({ _user: decoded.user_id });
      const user = await User.findOne({ _id: decoded.user_id });

      if (!profile || _.isEmpty(profile)) {
        console.log('NO PRO');
        const userSocial = await Social.create({});
        const userLocation = await Location.create({});

        profile = await Profile.create({
          _user: user._id,
          _social: userSocial._id,
          _location: userLocation._id,
          fullName: user.name,
          email: user.email,
        });

        return res.status(200).json({ profile });
      } else {
        console.log(profile[0]);
        return res.status(200).json({ profile: profile[0] });
      }
    } else {
      res.status(400).send('Invalid token');
    }
  });

  app.put('/api/profile', auth, async (req, res) => {
    const decoded = jwt.verify(req.body.token, keys.jwtSecretKey);

    if (decoded.user_id) {
      // return res.status(200).send(req.body.token);
      const profile = await Profile.findOne({ _user: decoded.user_id });

      if (profile?._id) {
        console.log('profile ', profile);
        req.body.photo = req.body.imageKey;

        const update = await Profile.updateOne(
          { _user: decoded.user_id },
          req.body,
          {
            upsert: false,
          },
        );

        const updatedProfile = await Profile.findOne({
          _user: decoded.user_id,
        });

        return res.status(200).json({ profile: updatedProfile });
      } else {
        res.status(400).send('Invalid token');
      }
    }
  });
};
