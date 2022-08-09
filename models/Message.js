const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    content: String,
    name: String,
  },
  {
    timestamps: true,
  },
);

mongoose.model('message', messageSchema);
