const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const NanozymeSchema = mongoose.Schema({
  nanozymeName: {
    type: String,
    require: true,
  },
  activity: {
    type: String,
    default: "N.A.",
  },
  pH: {
    type: String,
    default: "N.A.",
  },
  substrate: {
    type: String,
    default: "N.A.",
  },
  km: {
    type: String,
    default: "N.A.",
  },
  vmax: {
    type: String,
    default: "N.A.",
  },
  kcat: {
    type: String,
    default: "N.A.",
  },
  specificity: {
    type: String,
    default: "N.A.",
  },
  additionalInfo: {
    type: String,
    default: "N.A.",
  },
  reference: {
    type: String,
    require: true,
  },
  doi: {
    type: String,
    require: true,
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
