const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  user: String,
  verification_code: String,
  isUsed: Boolean,
});

const Passwords = mongoose.model('Passwords', passwordSchema);

module.exports = Passwords;
