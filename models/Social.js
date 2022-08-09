const mongoose = require('mongoose');
const { Schema } = mongoose;

const socialSchema = new Schema({
  ig: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  facebook: { type: String, default: '' },
});

mongoose.model('social', socialSchema);
