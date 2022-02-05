const mongoose = require("mongoose");

const NanozymeSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    pmid: {
        type: String,
        require: true
    },
    desc : {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: Date(),
    }
})

module.exports = Nanozyme = mongoose.model("nanozyme", NanozymeSchema);
