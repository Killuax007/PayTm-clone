const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  firstname: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  otp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "otp",
  },
});
const otpSchema = mongoose.Schema({
  otp: { type: String },
  expiration: { type: Date, default: Date.now, expires: 86400 },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    // required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);
const otp = mongoose.model("otp", otpSchema);

module.exports = { User, otp, Account };
