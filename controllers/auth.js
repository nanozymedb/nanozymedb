const passport = require("passport");
const Nanozyme = require("../models/Nanozyme");
const User = require("../models/User");
const FlaggedEntry = require("../models/FlaggedEntry");
const path = require("path");
const bcrypt = require("bcryptjs");
exports.signoutUser = async (req, res) => {
  req.logout();
  res.redirect("/home");
};
exports.getDashboard = async (req, res, next) => {
  let user = await req.user;
  let userType = await user.type;
  if (userType == 2) {
    await res.redirect("/admin/dashboard");
  } else if (userType == 1) {
    await res.redirect("/editor/dashboard");
  } else {
    res.render(path.join("auth", "dashboard"), { user });
  }
};
exports.getContributionPage = async (req, res) => {
  let user = await req.user;
  let entries = await Nanozyme.find({ contributedBy: req.user._id });
  res.render(path.join("auth", "contributions"), { user, entries });
};
exports.getRaiseFlag = async (req, res) => {
  let nanozymeId = await req.params.nanozymeId;
  let nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    await res.redirect("/search");
  }
  let user = await req.user;
  await res.render(path.join("auth", "raiseflag"), { nanozyme, user });
};
exports.postRaiseFlag = async (req, res) => {
  let user = req.user;
  const nanozymeId = await req.params.nanozymeId;
  let nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    res.redirect("/search");
  }
  const { changeRaised } = await req.body;
  let errors = [];
  if (!changeRaised) {
    errors.push({
      msg: "Please enter the change in this nanozyme you suggest",
    });
  }
  if (errors.length > 0) {
    res.render(path.join("auth", "raiseflag"), {
      user,
      errors,
      changeRaised,
      nanozyme,
    });
  } else {
    const flaggedNanozyme = await req.params.nanozymeId;
    const flaggedBy = await req.user._id;
    let newFlag = new FlaggedEntry({
      flaggedNanozyme: flaggedNanozyme,
      changeRaised: changeRaised,
      flaggedBy: flaggedBy,
    });
    try {
      await newFlag.save();
      await res.json(newFlag);
    } catch (error) {
      console.error(error);
    }
  }
};
exports.getChangePassword = async (req, res) => {
  let user = req.user;
  res.render(path.join("auth", "changepassword"), { user });
};
exports.postchangePassword = async (req, res) => {
  const { prevPassword, newPassword, newPassword2 } = req.body;
  let user = req.user;
  const id = user._id;
  let foundUser = await User.findById(id);

  let errors = [];
  if (!prevPassword || !newPassword || !newPassword2) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (errors.length > 0) {
    res.render(path.join("auth", "changepassword"), {
      user,
      errors,
    });
  } else {
    try {
      let isMatch = await bcrypt.compareSync(prevPassword, foundUser.password);
      if (!isMatch) {
        req.flash("error", "Passwords do not match");
        if (user.type == 2) {
          res.redirect("/user/change-password");
        } else if (user.type == 1) {
          res.redirect("/user/change-password");
        } else {
          res.redirect("/user/change-password");
        }
      } else {
        const salt = await bcrypt.genSalt(10);
        foundUser.password = await bcrypt.hashSync(newPassword, salt);
        await foundUser.save();
        req.flash("success_msg", "Password Changed");
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  }
};
