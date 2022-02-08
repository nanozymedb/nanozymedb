const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const FlaggedEntrySchema = mongoose.Schema({
  flaggedEntry: {
    type: String,
    required: true,
  },
  flaggedBy: {
    type: String,
    required: true,
  },
  changeRaised: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    default: Date(),
  },
});

module.exports = FlagEntry = mongoose.model("flagentry", FlaggedEntrySchema);
