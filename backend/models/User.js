const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const User = mongoose.model('user', userSchema);
User.createIndexes();
module.exports = User