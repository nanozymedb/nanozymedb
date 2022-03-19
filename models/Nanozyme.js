const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const NanozymeSchema = mongoose.Schema({
  nanozymeName: {
    type: String,
    require: true,
    trim: true,
  },
  activity: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  pH: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  substrate: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  km: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  vmax: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  kcat: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  specificity: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  additionalInfo: {
    type: String,
    default: "N.A.",
    trim: true,
  },
  reference: {
    type: String,
    require: true,
    trim: true,
  },
  doi: {
    type: String,
    require: true,
    trim: true,
  },
  searchTags: {
    type: String,
  },
  contributedBy: {
    type: String,
    require: true,
  },
  approved: {
    type: Number,
    // 0 Not 1 Approved
  },
  approvedBy: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    default: Date(),
  },
});

module.exports = Nanozyme = mongoose.model("nanozyme", NanozymeSchema);
