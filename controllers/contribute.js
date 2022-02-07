const Nanozyme = require("../models/Nanozyme");

exports.getContributeEntry = async (req,res)=>{
    
}
exports.postContributeEntry = async (req, res) => {
  const { nanozymeName, activity , pH, substrate, km, vmax, kcat, specificity, additionalInfo, reference, doi } = req.body;
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
    doi: doi
  });
  try {
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    console.error(error);
  }
};
