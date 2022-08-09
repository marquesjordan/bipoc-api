const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  title: String,
  summary: String,
  youtubeUrl: String,
  category: String,
  tags: String,
  imageKey: String,
  created: { type: Date, default: Date.now },
  published: Boolean,
  comments: [
    {
      body: String,
      commentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    },
  ],
});

mongoose.model('posts', postSchema);
