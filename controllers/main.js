let path = require("path");
const Nanozyme = require("../models/Nanozyme");
exports.getHomePage = async (req, res) => {
  await res.clearCookie("redirect");
  await res.render(path.join("publicviews", "home"));
  await console.log(req.cookies);
};
exports.getUserGateway = (req, res) => {
  res.render(path.join("publicviews", "usergateway"));
};

exports.getSearchPage = (req, res) => {
  res.render(path.join("publicviews", "searchpage"));
};
exports.getNanozymePage = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  const user = await req.user;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    await res.redirect("/home");
  }
  await res.clearCookie("redirect");
  await res.render(path.join("publicviews", "nanozymeinfo"), {
    nanozyme,
    user,
  });
};

exports.signinUserFromFlag = async (req, res) => {
  await res.cookie("redirect", {
    reason: req.query.reason,
    nanozymeId: req.query.nanozymeId,
  });
  await res.redirect("/user-gateway#signin");
  // res.redirect("/search_result");
};
