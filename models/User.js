const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String,
     required: true,
      unique: true
     },
  password: { type: String, required: true },
  img_url: { type: String, default: null },
  img_id: { type: String, default: null },
});

module.exports = mongoose.model('User', userSchema);
