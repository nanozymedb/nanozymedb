const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
        type: String,
        required: true,
      },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
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
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);
