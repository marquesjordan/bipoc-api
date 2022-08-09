const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');
const Post = mongoose.model('posts');
const auth = require('../middleware/auth');
const fs = require('fs');
const util = require('util');

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
};
