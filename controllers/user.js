const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const path = require("path");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.createUser = async (req, res) => {
  const user = req.user;
  const { fName, lName, email, password, password2, userPosition } =
    await req.body;

  let errors = [];

  if (!fName || !lName || !email || !password || !password2 || !userPosition) {
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
      userPosition,
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
        userPosition,
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
          userPosition: userPosition,
          confirmationCode: confirmationCode,
        });
        let verifyLink = `${process.env.DOMAIN}verify-user/${confirmationCode}`;
        const msg = {
          to: `${email}`, // Change to your recipient
          from: "nanozymedb@gmail.com", // Change to your verified sender
          subject: "Email Verification - NanozymeDB",
          html: `<div style=' font-family: Lucida Sans, sans-serif; display: flex; flex-direction: column; align-items: center; text-align: center;'> <table> <tr> <h1>Welcome to NanozymeDB</h1> </tr><tr> <p> Hey ${fName}, we're really excited to get you onboard, but first things first we need you to click on the link below to verify your email address. </p></tr><tr> <a style='margin: 30px; cursor: pointer;' href='${verifyLink}'> <button style=' background-color: #252525; color: #f4f4f4; cursor: pointer; border: none; padding: 15px; border-radius: 20px; font-size: large; ' > Verify my email </button> </a> </tr><tr> </tr><tr> <p> If you're facing any kind of trouble in clicking the above button we request you to paste the URL given below in the browser address bar or just click on the link </p><a href= '${verifyLink}'>${verifyLink}</a></tr><tr><p style='margin-top: 20px; text-align:center;'>NanozymeDB</p></tr></table></div>`,
        };
        sgMail
          .send(msg)
          .then(() => {
            // console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
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
  var token = await req.params.token;
  var user = await User.findOne({ confirmationCode: token });
  if (!user) {
    await res.redirect("/");
  }
  try {
    user.status = await "Active";
    await user.save();
    // await setTimeout(() => {
    //   res.redirect("/signin");
    // }, 1500);
    req.flash("success_msg", "User Verified, You can now login");
    res.redirect("/user-gateway");
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
  const foundUser = await User.findOne({ email: email });
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
        // await console.log(foundUser);
        let resetLink = `${process.env.DOMAIN}reset-password/${resetToken}`;

        const msg = {
          to: `${email}`, // Change to your recipient
          from: "nanozymedb@gmail.com", // Change to your verified sender
          subject: "Reset Password - NanozymeDB",
          html: `<div style=' font-family: Lucida Sans, sans-serif; display: flex; text-align:center; flex-direction: column; align-items: center; '> <table> <tr> <h1>NanozymeDB</h1> </tr><tr> <p> Hi ${foundUser.fName},Someone requested us to reset your NanozymeDB account password. To change your password click on the link below and follow the instructions. This link is valid for 1 hour. If not requested by you, just ignore this email. </p></tr><tr> <a style='margin: 30px' href='${resetLink}'> <button style=' background-color: #252525; color: #f4f4f4; cursor: pointer; border: none; padding: 15px; border-radius: 20px; font-size: large; ' > Reset Password </button> </a> </tr><tr> </tr><tr> <p> If the above button doesn't work click on the below link or paste this into your browser address bar. </p><a href='${resetLink}'> </a>${resetLink}</tr><tr><p style='margin-top: 20px; text-align:center;'>NanozymeDB</p></tr></table></div>`,
        };
        sgMail
          .send(msg)
          .then(() => {
            // console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
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

exports.postUnauthFlagPage = async (req, res) => {
  res.redirect(`/nanozyme/raise-flag/${req.query.to}`);
};
exports.redirectUnauthRaiseFlag = async (req, res) => {
  let nanozyme = req.query.nanozyme;
  let user = req.user;
  res.render(path.join("publicviews", "signin"), { user, flagEntry: nanozyme });
};
