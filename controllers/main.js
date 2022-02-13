let path = require("path");
const Nanozyme = require("../models/Nanozyme");
exports.getHomePage = async (req, res) => {
  res.clearCookie("search");
  let user = await req.user;
  await res.render(path.join("publicviews", "home"), { user });
  // await console.log(req.cookies);
};
exports.getUserGateway = async (req, res) => {
  res.clearCookie("search");
  let user = await req.user;
  res.render(path.join("publicviews", "usergateway"), { user });
};

exports.getSearchPage = async (req, res) => {
  res.clearCookie("search");
  let user = await req.user;
  var perPage = 20;
  var page = req.query.page || 1;
  Nanozyme.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      Nanozyme.count().exec((err, count) => {
        if (err) return next(err);
        res.render(path.join("publicviews", "searchpage"), {
          user,
          data: data,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    });
};

exports.getNanozymePage = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  const user = await req.user;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    await res.redirect("/home");
  }
  res.clearCookie("redirect");
  await res.render(path.join("publicviews", "nanozymeinfo"), {
    nanozyme,
    user,
  });
};

exports.getAboutPage = async (req, res) => {};
exports.getContactPage = async (req, res) => {};
exports.postContactPage = async (req, res) => {};
