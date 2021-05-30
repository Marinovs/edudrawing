const express = require('express');
const mongoose = require('mongoose');
const Users = require('./users.model');
const bcrypt = require('bcrypt');
const TokenGenerator = require('uuid-token-generator');
const Infos = require('../infos/infos.model');

const router = express.Router();
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(
  'mongodb+srv://root:edudrawing123@edudrawingcluster.scabd.mongodb.net/edudrawing?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

router.get('/api/users', async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

router.patch('/api/users/update', async (req, res) => {
  const user = await Users.findOne({
    email: req.body.email,
  });
  if (bcrypt.compareSync(req.body.oldpassword, user.password)) {
    const response = await Users.findOneAndUpdate(
      {
        email: req.body.email,
      },
      { password: bcrypt.hashSync(req.body.newpassword, 10) },
      {
        new: true,
      }
    );
    if (response == null) {
      return res.status(500).json({
        title: 'Updated failed',
        error: 'Failed to find user',
      });
    } else {
      return res.status(201).json({
        title: 'Succesfully update',
        user: response,
      });
    }
  } else {
    return res.status(500).json({
      title: 'Updated failed',
      error: 'Old password is wrong',
    });
  }
});

router.post('/login', async (req, res, next) => {
  Users.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res.status(500).json({
        title: 'server error',
        error: err,
      });
    if (!user) {
      return res.status(400).json({
        status: 400,
        title: 'email error',
        error: 'user not found',
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        status: 401,
        title: 'password error',
        error: 'password is not correct',
      });
    } else {
      Infos.findOne({ userId: user._id }).then((x) => {
        if (x == null) {
          return res.status(500).json({
            title: 'Find failed',
            error: 'Failed to find user',
          });
        } else {
          return res.status(200).json({
            title: 'login success',
            error: `welcome back, ${user.name}`,
            user: user,
            info: x,
            token: new TokenGenerator().generate(),
          });
        }
      });
    }
  });
});

router.post('/register', async (req, res) => {
  if (req.body.password === null) {
    return res.status(401).json({
      status: 401,
      title: 'password empty',
      error: 'password field empty',
    });
  }

  const alreadyReg = await Users.findOne({ email: req.body.email });

  const newUser = new Users({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    telephone: req.body.telephone != null || 0,
    isTeacher: req.body.isTeacher != null || 0,
    token: null,
  });

  newUser.save((err) => {
    if (err) {
      if (alreadyReg !== null) {
        return res.status(401).json({
          title: 'Error',
          err: 'Email already registered',
        });
      }
      return res.status(400).json({
        status: 400,
        title: 'error',
        err: err,
      });
    } else {
      const id = newUser._id;
      const newInfo = new Infos({
        userId: id,
        img: '',
        address: '',
        city: '',
        zip: '',
        notification: false,
      });
      newInfo.save((er) => {
        if (er) {
          return res.status(400).json({
            status: 400,
            title: 'error',
            err: err,
          });
        } else {
          return res.status(200).json({
            status: 200,
            title: 'register success',
            err: `welcome, ${newUser.name}`,
            token: new TokenGenerator().generate(),
          });
        }
      });
    }
  });
});

module.exports = router;
