const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;
const PORT_APP = 5173;

const URL = 'https://mychatback.onrender.com'

const http = require('http').Server(app);

const socketIO = require('socket.io')(http, {
   cors: {
      origin: URL
   },
});

app.get('api/chat', (req, res) => {
   res.json({
      message: 'Hello',
   });
});

const users = [];

socketIO.on('connection', socket => {
   socket.on('newUser', data => {
      users.push(data);
      socketIO.emit('responseNewUser', users);
   });

   socket.on('message', data => {
      socketIO.emit('response', data);
   });

   socket.on('typing', data => {
      socket.broadcast.emit('responseTyping', data);
   });

   socket.on('disconnect', () => {
      console.log(`${socket.id} disconnect`);
   });
});

http.listen(URL, () => {
   console.log('Server working');
});
