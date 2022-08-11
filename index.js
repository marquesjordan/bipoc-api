const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const mongoose = require('mongoose');
const Message = mongoose.model('message');
const keys = require('./config/keys');

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: `${keys.client}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-socket-header'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('New WS Connection');
  // Get the last 10 messages from the database.
  Message.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .exec((err, messages) => {
      if (err) return console.error(err);
      console.log('Messages ', messages);
      // Send the last messages to the user.
      socket.emit('init', messages);
    });

  socket.on('start_chat', () => {
    Message.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .exec((err, messages) => {
        if (err) return console.error(err);
        console.log('Messages ', messages);
        // Send the last messages to the user.
        socket.emit('push', messages);
      });
  });

  // Listen to connected users for a new message.
  socket.on('message', (msg) => {
    // Create a message with the content and the name of the user.
    const message = new Message({
      content: msg.content,
      name: msg.name,
    });

    // Save the message to the database.
    message.save((err) => {
      if (err) return console.error(err);
    });

    // Notify all other users about a new message.
    socket.broadcast.emit('push', msg);
  });
});

const API_PORT = 5000;
const port = process.env.PORT || API_PORT;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
