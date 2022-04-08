const Nanozyme = require("../models/Nanozyme");
const FlaggedEntry = require("../models/FlaggedEntry");
const path = require("path");
const User = require("../models/User");
exports.getEditorApprovedEntry = async (req, res) => {
  let user = await req.user;
  let totalentries = await Nanozyme.find({ approvedBy: user._id });
  let entries = await totalentries.length;
  var perPage = 20;
  var page = req.query.page || 1;
  Nanozyme.find({ approvedBy: user._id })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, approvedEntry) => {
      Nanozyme.count().exec(async (err, count) => {
        if (err) return next(err);
        // approvedEntry.length == 0
        //   ? res.json("Not found")
        //   :
        await res.render(path.join("editor", "approvedentry"), {
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
  let user = await req.user;
  var perPage = 20;
  let totalentries = await Nanozyme.find({ approved: 0 });
  let entries = await totalentries.length;
  var page = (await req.query.page) || 1;
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
  const {
    doi,
    searchTags,
    reference,
    additionalInfo,
    kcat,
    km,
    vmax,
    substrate,
    pH,
    temp,
    nanozymeName,
    activity,
  } = req.body;
  try {
    await Nanozyme.findByIdAndUpdate(nanozymeId, {
      nanozymeName: nanozymeName,
      activity: activity,
      pH: pH,
      doi: doi,
      temp: temp,
      searchTags: searchTags,
      reference: reference,
      additionalInfo: additionalInfo,
      kcat: kcat,
      km: km,
      vmax: vmax,
      substrate: substrate,
      approved: 1,
      approvedBy: user._id,
    });
    await User.findByIdAndUpdate(user._id, {
      $inc: { approvedCount: 1 },
    });

    await req.flash("success_msg", "Entry Approved");
    await res.redirect("/editor/dashboard");
  } catch (error) {
    console.error(error);
  }
};

exports.deleteUnapprovedEntry = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  try {
    await Nanozyme.findByIdAndDelete(nanozymeId);
    await res.redirect("/editor/dashboard");
  } catch (error) {
    console.error(error);
  }
};
exports.getNanozymeEditPage = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  const user = await req.user;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    await res.redirect("/home");
  }
  await res.render(path.join("editor", "entryeditpage"), {
    nanozyme,
    user,
  });
};

exports.postNanozymeEditPage = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  const user = await req.user;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  const {
    doi,
    searchTags,
    reference,
    additionalInfo,
    kcat,
    km,
    temp,
    vmax,
    substrate,
    pH,
    nanozymeName,
    activity,
  } = req.body;
  try {
    await Nanozyme.findByIdAndUpdate(nanozymeId, {
      nanozymeName: nanozymeName,
      activity: activity,
      pH: pH,
      temp: temp,
      doi: doi,
      searchTags: searchTags,
      reference: reference,
      additionalInfo: additionalInfo,
      kcat: kcat,
      km: km,
      vmax: vmax,
      substrate: substrate,
    });
    req.flash("success_msg", "Edit Successfull");
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
  if (!nanozyme) {
    await FlaggedEntry.findByIdAndDelete(flagged);
    await res.redirect("/editor/dashboard");
  }

  await res.render(path.join("editor", "flaggedentrydetails"), {
    flagged,
    nanozyme,
    user,
  });
};
exports.postFlaggedEntries = async (req, res) => {
  // let user = req.user;
  // let { flaggedEntry } = await req.params;
  // let flag = await FlaggedEntry.findById(flaggedEntry);
  // await res.json(flag);
  let user = await req.user;
  let flaggedEntryId = await req.params.flaggedEntry;
  let flaggedEntry = await FlaggedEntry.findOne({ _id: flaggedEntryId });
  if (!flaggedEntry) {
    res.status(400).redirect("/editor/flagged-entries");
  }
  let nanozymeId = await flaggedEntry.flaggedNanozyme;
  const {
    nanozymeName,
    activity,
    pH,
    substrate,
    km,
    temp,
    vmax,
    kcat,
    specificity,
    additionalInfo,
    reference,
    doi,
  } = await req.body;
  let errors = [];
  if (!nanozymeName || !reference || !doi) {
    errors.push({
      msg: "Please enter the change in this nanozyme you suggest",
    });
  }
  const nanozyme = await Nanozyme.findById(nanozymeId);

  if (errors.length > 0) {
    res.render(path.join("editor", "flaggedentrydetails"), {
      user,
      errors,
      nanozyme,
    });
  } else {
    await Nanozyme.findByIdAndUpdate(nanozyme._id, {
      nanozymeName: nanozymeName,
      activity: activity,
      pH: pH,
      substrate: substrate,
      km: km,
      temp: temp,
      vmax: vmax,
      kcat: kcat,
      specificity: specificity,
      additionalInfo: additionalInfo,
      reference: reference,
      doi: doi,
    });
    await FlaggedEntry.findByIdAndDelete(flaggedEntryId);
    await req.flash("success_msg", "Entry Updated");
    await res.redirect("/editor/flagged-entries");
  }
};
exports.deleteFlaggedEntry = async (req, res) => {
  const { nanozymeId, flaggedId } = await req.query;
  try {
    await Nanozyme.findByIdAndDelete(nanozymeId);
    if (flaggedId) {
      await FlaggedEntry.findByIdAndDelete(flaggedId);
    }
    // console.log([nanozymeId, flaggedId]);
    await req.flash("success_msg", "Deleted the entry");
    if (flaggedId) {
      await res.redirect("/editor/flagged-entries");
    }
    await res.redirect("/editor/dashboard");
  } catch (error) {
    console.error(error);
  }
};
