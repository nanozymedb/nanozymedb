const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
exports.createUser = async (req, res) => {
  const { fName, lName, email, password } = await req.body;
  let user = await User.findOne({ email: email });
  if (user) {
    res.json("User exists");
  }
  try {
    const confirmationCode = await crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    user = await new User({
      fName: fName,
      lName: lName,
      email: email,
      password: hashedPassword,
      confirmationCode: confirmationCode,
    });
    try {
      await user.save();
      res.json(user);
    } catch (error) {
      console.error([error, "Error in createUser block 1"]);
    }
  } catch (error) {
    console.error([error, "Error in createUser block 2"]);
  }
};
exports.verifyUser = async (req, res) => {
  var token = req.params.token;
  var user = await User.findOne({ confirmationCode: token });
  if (!user) {
    await res.redirect("/");
  }
  try {
    user.status = "Active";
    // user.save()
    // await setTimeout(() => {
    //   res.redirect("/signin");
    // }, 1500);
    res.json(user);
  } catch (error) {
    console.error([error, "Error in verifyUser block 1"]);
  }
};
exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  let user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).json("User not found");
  }
  try {
    const resetToken = await crypto.randomBytes(32).toString("hex");
    user.resetToken = await resetToken;
    user.resetTokenExpires = (await Date.now()) + 3600000; //time 1hrs
    await user.save();
  } catch (error) {
    console.error(error);
  }
  // send email with token
};
exports.resetPassword = async (req, res) => {
  const { prevPassword, newPassword } = req.body;
  const id = req.user.id;
  let user = await User.findById(id);
  try {
    let isMatch = await bcrypt.compare(prevPassword, user.password);
    if (!isMatch) {
      res.json("Password incorrect");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
  } catch (error) {
    console.error(error);
  }
};
