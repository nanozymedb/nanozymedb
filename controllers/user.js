const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
exports.createUser = async (req, res) => {
  const { fName, lName, email, password } = req.body;
  let user = await User.findOne({ email: email });
  if (user) {
    res.json("User exists");
  }
  try {
    const confirmationCode = await crypto.randomBytes(32).toString("hex");
    user = await new User({
      fName: fName,
      lName: lName,
      email: email,
      password: password,
      confirmationCode: confirmationCode,
    });
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.json(user)
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
    user.status = "Active"
    // user.save()
    // await setTimeout(() => {
    //   res.redirect("/signin");
    // }, 1500);
    res.json(user)
  } catch (error) {
    console.error([error, "Error in verifyUser block 1"]);
  }
};
