const mongoose = require("mongoose");

const nanozymeSchema = mongoose.Schema({
    fName: {
        type: String,
        require: true
    },
    lName:{
        type: String,
    },
    userType: {
        type: Number,
        require: true,
        default: 0
        // 0 for normal contributor or user
        // 1 for Editor or Monitor
        // 2 for Admin
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: Date(),
    }
})

module.exports = mongoose.model("nanozymeSchema", nanozymeSchema);