const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _company: { type: Schema.Types.ObjectId, ref: 'Company' },
  _social: { type: Schema.Types.ObjectId, ref: 'Social' },
  _location: { type: Schema.Types.ObjectId, ref: 'Location' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  fullName: { type: String, default: '' },
  title: { type: String, default: '' },
  pronoun: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  photo: { type: String, default: '' },
  bio: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  profileType: { type: String, default: '' },
});

mongoose.model('profile', profileSchema);
