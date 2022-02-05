const mongoose = require("mongoose");

const nanozymeSchema = mongoose.Schema({
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

module.exports = mongoose.model("nanozymeSchema", nanozymeSchema);