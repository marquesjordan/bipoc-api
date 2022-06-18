const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const API_PORT = 5000;
const port = process.env.PORT || API_PORT;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
