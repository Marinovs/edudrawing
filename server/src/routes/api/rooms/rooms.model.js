const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { required: true, type: String },
  master: { required: true, type: Object },
  subject: { required: true, type: String },
  password: { type: String },
  members: Number,
});

const Rooms = mongoose.model('Rooms', roomSchema);

module.exports = Rooms;
