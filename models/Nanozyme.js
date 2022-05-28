const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const NanozymeSchema = mongoose.Schema(
  {
    nanozymeName: {
      type: String,
      require: true,
      trim: true,
    },
    displayNanozymeName: {
      type: String,

      trim: true,
    },
    displayActivity: {
      type: String,
      default: "N.A.",
      trim: true,
    },
    activity: {
      type: String,
      default: "N.A.",
      trim: true,
    },
    pH: {
      // type: String,
      type: Number,
      // default: "N.A.",
      trim: true,
    },
    temp: {
      // type: String,
      type: Number,
      // default: "N.A.",
      trim: true,
    },
    substrate: {
      type: String,
      default: "N.A.",
      trim: true,
    },
    km: {
      // type: String,
      // default: "N.A.",
      type: Number,

      trim: true,
    },
    vmax: {
      // type: String,
      // default: "N.A.",
      type: Number,
      trim: true,
    },
    kcat: {
      // type: String,
      // default: "N.A.",
      type: Number,

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
    // searchTags: {
    //   type: String,
    // },
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
    searchTags: {
      type: String,
    },
    date: {
      type: String,
      default: Date(),
    },
  },
  { timestamps: true }
);
NanozymeSchema.index({
  // nanozymeName: "text",
  // substrate: "text",
  searchTags: "text",
});
module.exports = Nanozyme = mongoose.model("nanozyme", NanozymeSchema);
