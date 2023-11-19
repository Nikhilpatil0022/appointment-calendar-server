const Mongoose = require("mongoose");
const REGEX = require("../../constants/Regex.constants");

const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [REGEX.email, "Please enter a valid email address"],
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: false,
  },
});

UserSchema.index({
  first_name: "text",
  last_name: "text",
  email: "text",
  full_name: "text",
});

const User = Mongoose.model("User", UserSchema);
module.exports = User;
