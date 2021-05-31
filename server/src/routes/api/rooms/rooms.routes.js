const uuid4 = require('uuid4');
const express = require('express');
const mongoose = require('mongoose');
const Rooms = require('./rooms.model');
const Pages = require('../pages/pages.model');
const bcrypt = require('bcrypt');
const TokenGenerator = require('uuid-token-generator');

const router = express.Router();

mongoose.connect(
  'mongodb+srv://root:edudrawing123@edudrawingcluster.scabd.mongodb.net/edudrawing?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

router.get('/api/rooms', async (req, res) => {
  const rooms = await Rooms.find();
  res.send(rooms);
});

router.post('/api/rooms', async (req, res) => {
  let rooms = await Rooms.find();
  rooms = rooms.filter((x) => x.master._id === req.body.id);
  res.send(rooms);
});

router.post('/api/rooms/find', async (req, res, next) => {
  Rooms.findOne({ _id: req.body.id }, (err, room) => {
    if (err)
      return res.status(500).json({
        title: 'server error',
        error: err,
      });
    if (!room) {
      return res.status(400).json({
        status: 400,
        title: 'Failed to join room',
        error: 'room not found',
      });
    }
    if (
      room.password != null &&
      !bcrypt.compareSync(req.body.password, room.password)
    ) {
      return res.status(401).json({
        status: 401,
        title: 'Failed to join room',
        error: 'password is not correct',
      });
    } else {
      return res.status(200).json({
        title: 'Room join success',
        error: ``,
        room: room,
        token: new TokenGenerator().generate(),
      });
    }
  });
});

router.post('/api/rooms/create', async (req, res) => {
  const id = uuid4();
  const newRoom = new Rooms({
    name: req.body.name,
    subject: req.body.subject,
    master: req.body.master,
    members: 0,
  });

  if (req.body.password != null) {
    newRoom.password = bcrypt.hashSync(req.body.password, 10);
  }

  newRoom.save((err) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        title: 'error',
        err: err,
      });
    } else {
      const pageId = uuid4();
      const newPage = new Pages({
        id: pageId,
        content: '',
        roomId: newRoom._id,
      });

      newPage.save((pageErr) => {
        if (pageErr) {
          return res.status(401).json({
            title: 'create room sucess but page failed',
            err: `Create room failed: ${newRoom.name}`,
          });
        }
        return res.status(200).json({
          status: 200,
          title: 'create sucess',
          err: `Create page: ${newPage.name}`,
          token: new TokenGenerator().generate(),
          id: id,
          page: newPage,
          room: newRoom,
        });
      });
    }
  });
});

router.delete('/api/rooms', async (req, res) => {
  if (req.body.id !== undefined) {
    Rooms.findByIdAndDelete(req.body.id, (err) => {
      if (err) {
        return res.status(401).json({
          title: 'Deleted failed',
          error: `Room not find`,
        });
      } else {
        Pages.findOneAndDelete({ roomId: req.body.id }, (er) => {
          if (er) {
            return res.status(401).json({
              title: 'Deleted failed',
              error: `Room not find`,
            });
          } else {
            return res.status(200).json({
              status: 200,
              title: 'Deleted success',
              error: ``,
            });
          }
        });
      }
    });
  } else {
    Rooms.deleteMany({}, () => {
      Pages.deleteMany({}, () => {
        return res.status(200).json({
          title: 'Deleted success',
          error: ``,
        });
      });
    });
  }
});

router.patch('/api/rooms/update', async (req, res) => {
  Rooms.findOne({ _id: req.body.id }, (err, room) => {
    if (err)
      return res.status(500).json({
        title: 'server error',
        error: err,
      });
    if (!room) {
      return res.status(400).json({
        status: 400,
        title: 'Failed to join room',
        error: 'room not found',
      });
    } else {
      Rooms.findOneAndUpdate(
        { _id: room._id },
        { members: room.members - 1 },
        { new: true },
        (er) => {
          if (er) {
            return res.status(401).json({
              title: 'Deleted failed',
              error: `Room not find`,
            });
          } else {
            room.members = -1;
            return res.status(200).json({
              title: 'Update success',
              error: ``,
              room: room,
            });
          }
        }
      );
    }
  });
});

module.exports = router;
