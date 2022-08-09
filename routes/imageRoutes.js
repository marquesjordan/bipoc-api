const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('users');
const Post = mongoose.model('posts');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { getFileStream, uploadFile } = require('../utils/s3');

module.exports = (app) => {
  app.get('/api/images/:key', async (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
  });

  app.post('/api/image', upload.single('image'), async (req, res, next) => {
    try {
      const file = req.file;
      const result = await uploadFile(file);

      await unlinkFile(file.path);

      return res.status(200).send({ image: result });
    } catch (err) {
      console.log(err);
      return res.status(400).send('Post Error');
    }
  });
};
