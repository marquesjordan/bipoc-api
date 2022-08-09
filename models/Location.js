const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zip: { type: String, default: '' },
});

mongoose.model('location', locationSchema);
