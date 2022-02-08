const passport = require("passport");
const Nanozyme = require("../models/Nanozyme");
const User = require("../models/User");
const FlaggedEntry = require("../models/FlaggedEntry");
const path = require("path");

exports.signinUser = async (req, res) => {};

exports.signoutUser = async (req, res) => {};
exports.getDashboard = async (req, res, next) => {
  const { redirect } = await req.cookies;
  if (redirect == undefined) {
    await res.json(req.user);
  }
};
exports.getRaiseFlag = async (req, res) => {
  let nanozymeId = req.params.nanozymeId;
  let nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    res.redirect("/search");
  }
  res.render(path.join("auth", "raiseflag"), { nanozyme });
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
