const Nanozyme = require("../models/Nanozyme");
const path = require("path");
exports.getContributeEntry = async (req, res) => {
  let user = await req.user;
  res.render(path.join("auth", "contribute"), { user });
};
exports.postContributeEntry = async (req, res) => {
  const user = req.user;
  const {
    nanozymeName,
    activity,
    pH,
    substrate,
    km,
    vmax,
    kcat,
    specificity,
    additionalInfo,
    reference,
    doi,
  } = req.body;
  let newEntry = new Nanozyme({
    nanozymeName: nanozymeName,
    activity: activity,
    pH: pH,
    substrate: substrate,
    km: km,
    vmax: vmax,
    kcat: kcat,
    specificity: specificity,
    additionalInfo: additionalInfo,
    reference: reference,
    doi: doi,
    contributedBy: req.user._id,
  });

  let errors = [];

  if (!nanozymeName || !doi || !reference) {
    errors.push({ msg: "Please enter required fields" });
  }
  if (errors.length > 0) {
    res.render(path.join("auth", "contribute"), {
      user,
      nanozymeName,
      activity,
      pH,
      substrate,
      km,
      vmax,
      kcat,
      specificity,
      additionalInfo,
      reference,
      doi,
      errors,
    });
  } else {
    try {
      await newEntry.save();
      req.flash(
        "success_msg",
        "Thank you for your contribution to the NanozymeDB"
      );
      res.redirect("/contribute/add-entry");
    } catch (error) {
      console.error(error);
    }
  }
};
