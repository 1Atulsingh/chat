const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const users={};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);
  io.emit('a user connected', socket.id);

socket.on('set Nickname',(nickname)=>{
  console.log('your name is '+ socket.id+ ":"+ nickname);
  users[socket.id]=nickname;
  io.emit('chat message', {nickname:'Server',msg:`${nickname} has connected.`});
  io.emit('onlineUsers', Object.values(users)); 
});

  socket.on('disconnect', () => {
    console.log('a user disconnected: ' + socket.id);
    io.emit('a user disconnected', socket.id);
    delete users[socket.id];
    io.emit('onlineUsers', Object.values(users));
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { nickname: users[socket.id], msg: msg });
  });

  
//Listening for the typing event from the client
socket.on('typing', () => {
  socket.broadcast.emit('typing', users[socket.id]);
  });
// Send the initial online user list to the connected client
  socket.emit('onlineUsers', Object.values(users));
});

  


server.listen(3000, () => {
  console.log('listening on *:3000');
});
