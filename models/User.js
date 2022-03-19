const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,},
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
      trim: true,},
    type: {
      type: Number,
      default: 0,
    },
    confirmationCode: {
      type: String,
      unique: false,
      sparse: true,
    },
    resetToken: {
      type: String,
      unique: false,
      sparse: true,
      default: "",
      required: false,
    },
    resetTokenExpires: {
      type: Date,
      required: false,
      unique: false,
      sparse: true,
      default: "",
    },
    lastPasswordChanged: {
      type: Date,
      required: false,
      unique: false,
      sparse: true,
    },
    userPosition: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    approvedEntriesCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);
