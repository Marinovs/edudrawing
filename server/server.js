const Socket = require('./src/socket');
const express = require('express');
const cors = require('cors');

const routes = require('./src/routes/router');

const app = express();
const port = 5000;
const socketPort = 5001;
const io = require('socket.io')(socketPort, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(routes);

const socket = new Socket(io);
socket.modelLoaded();

app.listen(port, () => {
  console.log(`HTTP server is running 🚀 on port ${port}
Socket service running 🚀 on port ${socketPort}
Process Pid: ${process.pid}`);
});

/* 
io.sockets.on('connection', function (socket) {
  // generate name and color
  socket.name = 'Guest' + parseInt(Math.random() * 1000);

  // signal all sockets of the new client
  io.sockets.emit('new_client', { name: socket.name, color: socket.color });

  socket.on('usr_recv', function (data) {
    console.log(data);
    io.sockets.emit('new_usr', { sender: socket.name, usr: data.usr });
  });

  // when a message is received
  socket.on('msg_recv', function (data) {
    console.log(data);
    // notify all clients
    io.sockets.emit('new_msg', { sender: socket.name, msg: data.msg });
  });

  // delta received
  socket.on('send_delta', function (data) {
    // notify the OTHER clients');
    console.log(delta);

    socket.broadcast.emit('recv_delta', data);
  });

  // d/c
  socket.on('disconnect', function () {
    io.sockets.emit('drop_client', { name: socket.name });
  });
});

app.listen(5000, () => console.log(`Server started on port 5000`)); */
