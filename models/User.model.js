const mongoose = require('mongoose');
const schema = mongoose.Schema();

const UserSchema = new schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', UserSchema);
