const uuid4 = require('uuid4');
const express = require('express');
const mongoose = require('mongoose');
const Passwords = require('./passwords.model');
const router = express.Router();

mongoose.connect(
  'mongodb+srv://root:edudrawing123@edudrawingcluster.scabd.mongodb.net/edudrawing?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

router.get('/api/passwords', async (req, res) => {
  const passwords = await Passwords.find();
  res.send(passwords);
});

router.post('/api/passwords', async (req, res) => {
  const passwords = await Passwords.find();
  const pass = passwords.filter((x) => x.verification_code == req.body.id);

  res.send(pass);
});

router.post('/api/passwords/put', async (req, res) => {
  const newPassword = new Passwords({
    user: req.body.user,
    verification_code: req.body.code,
    isUsed: false,
  });

  newPassword.save((er) => {
    if (er) {
      console.log(err);
      return res.status(400).json({
        status: 400,
        title: 'error',
        err: err,
      });
    } else {
      return res.status(200).json({
        status: 200,
        title: 'Password reset success',
      });
    }
  });
});

module.exports = router;
