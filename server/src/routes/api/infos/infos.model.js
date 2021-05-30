const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  userId: { type: String },
  img: { type: String },
  address: { type: String },
  city: { type: String },
  zip: { type: Number },
  notification: { type: Boolean },
});

const Infos = mongoose.model('Infos', infoSchema);

module.exports = Infos;
