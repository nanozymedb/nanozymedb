const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const FlaggedEntrySchema = mongoose.Schema(
  {
    flaggedNanozyme: {
      type: Schema.Types.ObjectId,
      ref: "nanozyme",
      // type: String,
      required: true,
    },
    flaggedBy: {
      type: Schema.Types.ObjectId,
      // type: String,
      ref: "user",
      required: true,
    },
    flaggedNanozymeName: {
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
  },

  { timestamps: true }
);

module.exports = FlagEntry = mongoose.model("flagentry", FlaggedEntrySchema);
