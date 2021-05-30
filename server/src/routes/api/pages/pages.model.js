const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  id: { required: true, type: String },
  content: { type: Object },
  roomId: { type: String },
});

const Pages = mongoose.model('Pages', pageSchema);

module.exports = Pages;
