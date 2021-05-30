const uuid4 = require('uuid4');
const express = require('express');
const mongoose = require('mongoose');
const Pages = require('./pages.model');
const bcrypt = require('bcrypt');
const TokenGenerator = require('uuid-token-generator');

const router = express.Router();

mongoose.connect(
  'mongodb+srv://root:edudrawing123@edudrawingcluster.scabd.mongodb.net/edudrawing?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

router.get('/api/pages', async (req, res) => {
  const pages = await Pages.find();
  res.send(pages);
});

router.get('/api/pages/findByRoomId', async (req, res, next) => {
  Pages.findOne({ roomId: req.body.roomId }, (err, page) => {
    if (err)
      return res.status(500).json({
        title: 'server error',
        error: err,
      });
    if (!page) {
      return res.status(400).json({
        status: 400,
        title: 'Failed to join page',
        error: 'page not found',
      });
    } else {
      return res.status(200).json({
        title: 'Page found',
        error: ``,
        page: page,
        token: new TokenGenerator().generate(),
      });
    }
  });
});

router.post('/api/pages/find', async (req, res, next) => {
  Pages.findOne({ id: req.body.id }, (err, page) => {
    if (err)
      return res.status(500).json({
        title: 'server error',
        error: err,
      });
    if (!page) {
      return res.status(400).json({
        status: 400,
        title: 'Failed to join page',
        error: 'page not found',
      });
    } else {
      return res.status(200).json({
        title: 'Page found',
        error: ``,
        page: page,
        token: new TokenGenerator().generate(),
      });
    }
  });
});

router.post('/api/pages/create', async (req, res) => {
  const id = uuid4();
  const newPage = new Pages({
    id: id,
    content: '',
    roomId: req.body.roomId,
  });

  newPage.save((err) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        title: 'error',
        err: err,
      });
    }
    return res.status(200).json({
      status: 200,
      title: 'create sucess',
      err: `Create page: ${newPage.name}`,
      token: new TokenGenerator().generate(),
      id: id,
    });
  });
});

router.patch('/api/pages/update', async (req, res) => {
  Pages.findOneAndUpdate(
    { roomId: req.body.roomId },
    { content: req.body.content },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          title: 'error',
          err: err,
        });
      }
      return res.status(200).json({
        status: 200,
        title: 'Updated',
        err: `Updated page`,
        content: req.body.content,
      });
    }
  );
});

module.exports = router;
