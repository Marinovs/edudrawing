const express = require('express');
const mongoose = require('mongoose');
const Infos = require('./infos.model');
const multer = require('multer');
const path = require('path');

const router = express.Router();

mongoose.connect(
  'mongodb+srv://root:edudrawing123@edudrawingcluster.scabd.mongodb.net/edudrawing?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

var Storage = multer.diskStorage({
  destination: '../client/public/uploads/',
  filename: (req, file, cb) => {
    cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: Storage,
}).single('file');

router.get('/api/infos', async (req, res) => {
  const infos = await Infos.find();
  res.send(infos);
});

router.get('/api/infos/find', async (req, res) => {
  const response = await Infos.findOne({ userId: req.body.userId });
  if (response == null) {
    return res.status(500).json({
      title: 'Find failed',
      error: 'Failed to find user',
    });
  } else {
    return res.status(201).json({
      title: 'Succesfully update',
      info: response,
    });
  }
});

router.patch('/api/infos/update', async (req, res) => {
  console.log(req.body);
  const userId = req.body.userId;
  const response = await Infos.findOneAndUpdate({ userId: userId }, req.body, {
    new: true,
  });
  if (response == null) {
    return res.status(500).json({
      title: 'Updated failed',
      error: 'Failed to find user',
    });
  } else {
    return res.status(201).json({
      title: 'Succesfully update',
      info: response,
    });
  }
});

router.patch('/api/infos/avatar', upload, async (req, res) => {
  const response = await Infos.findOneAndUpdate(
    {
      userId: req.body.userId,
    },
    { img: req.file.filename },
    { new: true }
  );
  if (response == null) {
    return res.status(500).json({
      title: 'Updated failed',
      error: 'Failed to find user',
    });
  } else {
    return res.status(201).json({
      title: 'Succesfully update',
      info: response,
    });
  }
});

module.exports = router;
