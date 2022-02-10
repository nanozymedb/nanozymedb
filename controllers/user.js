const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const path = require("path");
exports.createUser = async (req, res) => {
  const user = req.user;
  const { fName, lName, email, password, password2 } = await req.body;

  let errors = [];

  if (!fName || !lName || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render(path.join("publicviews", "usergateway"), {
      user,
      errors,
      fName,
      lName,
      email,
      password,
      password2,
    });
  } else {
    let user = await User.findOne({ email: email });
    if (user) {
      errors.push({ msg: "Email already exists" });
      res.render(path.join("publicviews", "usergateway"), {
        user,
        errors,
        fName,
        lName,
        email,
        password,
        password2,
      });
    } else {
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
          req.flash(
            "success_msg",
            "You are now registered, Please verify your email address"
          );
          res.redirect("/user-gateway#signup");
        } catch (error) {
          console.error([error, "Error in createUser block 1"]);
        }
      } catch (error) {
        console.error([error, "Error in createUser block 2"]);
      }
    }
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
exports.postforgotPassword = async (req, res) => {
  const email = req.body.email;
  let errors = [];

  if (!email) {
    errors.push({ msg: "Please enter email address" });
  }
  let user = req.user;
  let foundUser = await User.findOne({ email: email });
  if (errors.length > 0) {
    res.render(path.join("publicviews", "forgotpassword"), {
      user,
      errors,
      email,
      foundUser,
    });
  } else {
    if (!foundUser) {
      errors.push({ msg: "User with this email not found" });
      res.render(path.join("publicviews", "forgotpassword"), {
        user,
        errors,
        email,
        foundUser,
      });
    } else {
      try {
        const resetToken = await crypto.randomBytes(32).toString("hex");
        foundUser.resetToken = await resetToken;
        foundUser.resetTokenExpires = (await Date.now()) + 3600000; //time 1hrs
        // console.log(foundUser);

        await foundUser.save();
        req.flash(
          "success_msg",
          "An email with reset link is sent to the registered email"
        );
        res.redirect("/user-gateway");
      } catch (error) {
        console.error(error);
      }
    }
    // send email with token
  }
};
exports.getforgotPassword = async (req, res) => {
  let user = req.user;
  res.render(path.join("publicviews", "forgotpassword"), { user });
};
exports.postResetPassword = async (req, res) => {
  const { password, password2 } = req.body;
  let user = await req.user;
  let { resetToken } = await req.params;
  const validUser = await User.findOne({
    resetToken: resetToken,
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!validUser) {
    await res.redirect("/user-gateway");
    await req.flash("error_msg", "Session Expired, Please try again");
  } else {
    let errors = [];
    if (!password || !password2) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (errors.length > 0) {
      res.render(path.join("publicviews", "resetpassword"), {
        user,
        errors,
        resetToken,
      });
    } else {
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hashSync(password, salt);
      try {
        validUser.password = hashedPassword;
        validUser.resetToken = "";
        validUser.resetTokenExpires = "";
        validUser.lastPasswordChanged = Date.now();
        await validUser.save();
        req.flash("success_msg", "Password Changed Successfully");
        res.redirect("/user-gateway");
      } catch (error) {
        console.error(error);
        res.json({ Msg: "Server Error" });
      }
    }
  }
};
exports.getResetPassword = async (req, res) => {
  if (req.params.resetToken == undefined) {
    res.redirect("/home");
  }
  let user = req.user;
  let resetToken = req.params.resetToken;
  res.render(path.join("publicviews", "resetpassword"), { user, resetToken });
};
