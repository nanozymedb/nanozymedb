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
      additionalInfo,
      reference,
      doi,
      errors,
    });
  } else {
    try {
      // let searchString = await nanozymeName.trim().concat(" ", activity.trim());
      // newEntry.searchTags = await searchString;
      await newEntry.save();
      await req.flash(
        "success_msg",
        "Thank you for your contribution to the NanozymeDB"
      );
      await res.redirect("/contribute/add-entry");
    } catch (error) {
      console.error(error);
    }
  }
};
