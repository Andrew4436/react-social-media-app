const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  followers: [],
  following: [],
  posts: [Object],
  pfp: String,
});

module.exports = mongoose.model("user", userSchema);
