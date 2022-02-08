const Nanozyme = require("../models/Nanozyme");
const path = require("path");
exports.getEditorApprovedEntry = async (req, res) => {
  let user = req.user;
  var perPage = 20;
  var page = req.query.page || 1;
  Nanozyme.find({ approvedBy: user._id })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, approvedEntry) => {
      Nanozyme.count().exec((err, count) => {
        if (err) return next(err);
        approvedEntry.length == 0
          ? res.json("Not found")
          : res.render(path.join("editor", "approvedentry"), {
              user,
              approvedEntry: approvedEntry,
              current: page,
              pages: Math.ceil(count / perPage),
            });
      });
    });
};
exports.getEditorDashboard = async (req, res) => {
  let user = req.user;
  res.render(path.join("editor", "editor"), { user });
};

exports.getUnapprovedEntry = async (req, res) => {
  let user = req.user;
  var perPage = 20;
  var page = req.query.page || 1;
  Nanozyme.find({ approved: 0 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, unapprovedEntry) => {
      Nanozyme.count().exec((err, count) => {
        if (err) return next(err);
        unapprovedEntry.length == 0
          ? res.json("Not found")
          : res.render(path.join("editor", "unapprovedentry"), {
              user,
              unapprovedEntry: unapprovedEntry,
              current: page,
              pages: Math.ceil(count / perPage),
            });
      });
    });
};
exports.getNanozymeApprovalPage = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  const user = await req.user;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    await res.redirect("/home");
  }
  await res.render(path.join("editor", "nanozymeapproval"), {
    nanozyme,
    user,
  });
};

exports.postNanozymeApprovalPage = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  const user = await req.user;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  try {
    nanozyme.approved = 1;
    nanozyme.approvedBy = user._id;
    await nanozyme.save();
    res.redirect("/editor/dashboard");
  } catch (error) {
    console.error(error);
  }
};

exports.deleteUnapprovedEntry = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  try {
    await Nanozyme.findByIdAndDelete(nanozymeId);
    res.redirect("/editor/dashboard");
  } catch (error) {
    console.error(error);
  }
};
