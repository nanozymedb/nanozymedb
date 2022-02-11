const Nanozyme = require("../models/Nanozyme");
const FlaggedEntry = require("../models/FlaggedEntry");
const path = require("path");
const User = require("../models/User");
exports.getEditorApprovedEntry = async (req, res) => {
  let user = req.user;
  let totalentries = Nanozyme.find({ approvedBy: user._id });
  let entries = totalentries.length;
  var perPage = 20;
  var page = req.query.page || 1;
  Nanozyme.find({ approvedBy: user._id })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, approvedEntry) => {
      Nanozyme.count().exec((err, count) => {
        if (err) return next(err);
        // approvedEntry.length == 0
        //   ? res.json("Not found")
        //   :
        res.render(path.join("editor", "approvedentry"), {
          user,
          entries,
          approvedEntry: approvedEntry,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    });
};
exports.getEditorDashboard = async (req, res) => {
  let user = await req.user;
  await res.render(path.join("editor", "editor"), { user });
};

exports.getUnapprovedEntry = async (req, res) => {
  let user = req.user;
  var perPage = 20;
  let totalentries = Nanozyme.find({ approved: 0 });
  let entries = totalentries.length;
  var page = req.query.page || 1;
  Nanozyme.find({ approved: 0 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, unapprovedEntry) => {
      Nanozyme.count().exec((err, count) => {
        if (err) return next(err);
        // unapprovedEntry.length == 0
        //   ? res.json("Not found")
        //   :
        res.render(path.join("editor", "unapprovedentry"), {
          user,
          entries,
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
    await Nanozyme.findByIdAndUpdate(nanozymeId, {
      approved: 1,
      approvedBy: user._id,
    });
    await User.findByIdAndUpdate(user._id, {
      $inc: { approvedCount: 1 },
    });

    req.flash("success_msg", "Entry Approved");
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
exports.getFlaggedEntries = async (req, res) => {
  let user = await req.user;
  let totalentries = FlaggedEntry.find();
  let entries = totalentries.length;
  var perPage = 20;
  var page = req.query.page || 1;
  FlaggedEntry.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, flaggedEntry) => {
      FlaggedEntry.count().exec((err, count) => {
        if (err) return next(err);
        // flaggedEntry.length == 0
        //   ? res.json("Not found")
        //   :
        res.render(path.join("editor", "flaggedentry"), {
          user,
          entries,
          flaggedEntry: flaggedEntry,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    });
};
exports.getFlaggedEntryDetails = async (req, res) => {
  const { flaggedEntry } = await req.params;
  const user = await req.user;
  const flagged = await FlaggedEntry.findById(flaggedEntry);
  if (!flagged) {
    await res.redirect("/editor/dashboard");
  }
  const nanozyme = await Nanozyme.findById(flagged.flaggedNanozyme);
  await res.render(path.join("editor", "flaggedentrydetails"), {
    flagged,
    nanozyme,
    user,
  });
};
// exports.postFlaggedEntries = async (req, res) => {
//   let user = await req.user;
//   var perPage = 20;
//   var page = req.query.page || 1;
//   FlaggedEntry.find()
//     .skip(perPage * page - perPage)
//     .limit(perPage)
//     .exec((err, flaggedEntry) => {
//       FlaggedEntry.count().exec((err, count) => {
//         if (err) return next(err);
//         flaggedEntry.length == 0
//           ? res.json("Not found")
//           : res.render(path.join("editor", ""), {
//               user,
//               flaggedEntry: flaggedEntry,
//               current: page,
//               pages: Math.ceil(count / perPage),
//             });
//       });
//     });
// };
exports.deleteFlaggedEntry = async (req, res) => {
  const { nanozymeId, flaggedId } = await req.query;
  try {
    await Nanozyme.findByIdAndDelete(nanozymeId);
    await FlaggedEntry.findByIdAndDelete(flaggedId);
    // console.log([nanozymeId, flaggedId]);
    req.flash("success_msg", "Deleted the entry");
    res.redirect("/editor/flagged-entries");
  } catch (error) {
    console.error(error);
  }
};
