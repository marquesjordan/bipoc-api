module.exports = {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  jwtSecretKey: process.env.JWT_SECRET,
  bucketName: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEYS,
  secretAccessKey: process.env.AWS_SECRET_KEYS,
  client: process.env.CLIENT,
};
