const passport = require("passport");
const Nanozyme = require("../models/Nanozyme");
const User = require("../models/User");
const FlaggedEntry = require("../models/FlaggedEntry");
const path = require("path");

exports.signinUser = async (req, res) => {};

exports.signoutUser = async (req, res) => {
  req.logout();
  res.redirect("/home");
};
exports.getDashboard = async (req, res, next) => {
  const { redirect } = await req.cookies;
  if (redirect == undefined) {
    let user = req.user;
    let entries = await Nanozyme.find({ contributedBy: req.user._id });
    res.render(path.join("auth", "dashboard"), { user, entries });
  }
};
exports.getRaiseFlag = async (req, res) => {
  let nanozymeId = req.params.nanozymeId;
  let nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    res.redirect("/search");
  }
  let user = req.user;
  res.render(path.join("auth", "raiseflag"), { nanozyme, user });
};
exports.postRaiseFlag = async (req, res) => {
  const nanozymeId = req.params.nanozymeId;
  let nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    res.redirect("/search");
  }
  const { changeRaised } = req.body;
  const flaggedEntry = req.params.nanozymeId;
  const flaggedBy = req.user._id;
  let newFlag = new FlaggedEntry({
    flaggedEntry: flaggedEntry,
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

// Redirect from flag
exports.postRedirectedUserGateway = async (req, res, next) => {
  const { redirect } = await req.cookies;
  if (redirect != undefined) {
    await res.redirect(`/nanozyme/raise-flag/${redirect.nanozymeId}`);
  }
  next();
};
