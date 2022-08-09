const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new Schema({
  _createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  _social: { type: Schema.Types.ObjectId, ref: 'Social' },
  _location: { type: Schema.Types.ObjectId, ref: 'Location' },
  name: { type: String, default: 'Some Company' },
  website: { type: String, default: '' },
  logo: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  bio: { type: String, default: '' },
});

mongoose.model('company', companySchema);
