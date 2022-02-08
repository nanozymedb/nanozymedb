let path = require("path");
const Nanozyme = require("../models/Nanozyme");
exports.getHomePage = async (req, res) => {
  await res.clearCookie("redirect");
  let user = await req.user;
  await res.render(path.join("publicviews", "home"), { user });
  await console.log(req.cookies);
};
exports.getUserGateway = async (req, res) => {
  let user = await req.user;

  res.render(path.join("publicviews", "usergateway"), { user });
};

exports.getSearchPage = async (req, res) => {
  let user = await req.user;
  res.render(path.join("publicviews", "searchpage"), { user });
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
