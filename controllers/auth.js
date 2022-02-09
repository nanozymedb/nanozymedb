const passport = require("passport");
const Nanozyme = require("../models/Nanozyme");
const User = require("../models/User");
const FlaggedEntry = require("../models/FlaggedEntry");
const path = require("path");

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
    let entries = await Nanozyme.find({ contributedBy: req.user._id });
    res.render(path.join("auth", "dashboard"), { user, entries });
  }
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
  const nanozymeId = await req.params.nanozymeId;
  let nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    res.redirect("/search");
  }
  const { changeRaised } = await req.body;
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
};
