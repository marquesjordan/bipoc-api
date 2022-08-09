const mongoose = require('mongoose');
const keys = require('./keys');

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(keys.mongoURI, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('Successfully connected to database');
    })
    .catch((error) => {
      console.log('database connection failed. exiting now...');
      console.error(error);
      process.exit(1);
    });
};

keys.mongoURI;
