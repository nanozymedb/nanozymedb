const nanozymeSchema = require("../models/Nanozyme");

exports.getContributorProfile= async (req,res)=>{
  // Profile Update or Create Profile
}
exports.postContributorProfile = async (req,res)=>{
  // Profile Update or Create Profile 
}

exports.getContributeEntry = async (req,res)=>{
    
}
exports.postContributeEntry = async (req, res) => {
  const { name, pmid, desc } = req.body;
  let newEntry = new nanozymeSchema({
    name: name,
    pmid: pmid,
    desc: desc,
  });
  try {
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    console.error(error);
  }
};
