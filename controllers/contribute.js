const Nanozyme = require("../models/Nanozyme");
const path = require("path");
exports.getContributeEntry = async (req, res) => {
  let user = await req.user;
  res.render(path.join("auth", "contribute"), { user });
};
exports.postContributeEntry = async (req, res) => {
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
  try {
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    console.error(error);
  }
};
