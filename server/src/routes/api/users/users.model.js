const express = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  surname: { required: true, type: String },
  email: { required: true, unique: true, type: String },
  password: { required: true, type: String },
  telephone: Number,
  isTeacher: Boolean,
  token: String,
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
