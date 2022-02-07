let path = require("path");
const Nanozyme = require("../models/Nanozyme");
exports.getHomePage = (req, res) => {
  res.render(path.join("publicviews", "home"));
};
exports.getUserGateway = (req, res) => {
  res.render(path.join("publicviews", "usergateway"));
};
exports.getSearchPage = (req, res) => {
  res.render(path.join("publicviews", "searchpage"));
};
exports.getNanozymePage = async (req, res) => {
  const nanozymeId = req.params.nanozymeId;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    res.redirect("/home");
  }
  res.render(path.join("publicviews", "nanozymeinfo"), { nanozyme });
};
