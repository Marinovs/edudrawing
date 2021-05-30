const { use } = require('./routes/api/users/user.routes');
const Pages = require('./routes/api/pages/pages.model');
const RoomsService = require('./routes/api/rooms/rooms.service');

let rooms = [];
let users = [];
let writers = [];

const RService = new RoomsService();

class Socket {
  constructor(io) {
    this.io = io;
    this.connections = [];
  }
  modelLoaded() {
    const { io } = this;

    //user connecred
    io.on('connection', (socket) => {
      socket.on('get-page', async (master, user, room) => {
        const page = await Pages.findOne({ roomId: room });
        socket.join(room);
        socket.emit('load-page', page?.content ?? null);

        socket.on('send-changes', (delta) => {
          socket.broadcast.to(page.roomId).emit('receive-changes', delta);
        });

        socket.on('save-page', async (data) => {
          await Pages.findOneAndUpdate(
            { roomId: room },
            { content: data },
            (err) => {
              if (err) {
                console.log('error');
              }
            }
          );
        });
        console.log(`${user._id}:${user.name} connected`);
        users.push({ user: user, room: room, socket: socket.id });
        if (room !== undefined) RService.addMembers(room);
        io.to(page.roomId).emit('receive-users', users);

        let writerMaster = writers.find(
          (x) => x.user._id === master._id && x.room._id == room._id
        );

        if (!writerMaster) {
          writers.push({ user: master, room: room, socket: socket.id });
        }
        io.to(page.roomId).emit('receive-writers', writers);

        socket.on('send-permission', async (u, r) => {
          writers.push({ user: u.user, room: r, socket: user.socket });
          io.to(page.roomId).emit('receive-permission', writers, u);
        });

        socket.on('send-remove-permission', async (u, r) => {
          writers = writers.filter((x) => x.socket === u.socket);
          io.to(page.roomId).emit('receive-remove-permission', writers, u);
        });

        socket.on('send-kick', async () => {
          users.forEach((u) => (u.room = null));
          io.to(page.roomId).emit('receive-kick');
        });
      });

      // d/c
      socket.on('disconnect', async function (data) {
        let user = users.find((x) => x.socket === socket.id);
        let writer = writers.find((x) => x.socket === socket.id);
        if (user) {
          users.splice(users.indexOf(user), 1);
          if (user.room !== null) RService.removeMembers(user.room);
          console.log(`${user.user._id}:${user.user.name} disconnected`);
          io.to(user.room).emit('receive-users', users);
        }
      });
    });
  }
}

module.exports = Socket;
