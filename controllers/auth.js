const passport = require("passport")
const User = require("../models/User")

exports.signinUser = async (req,res)=>{
    
}
exports.signoutUser = async (req,res)=>{

}
exports.getDashboard = async (req,res)=>{
    res.json(req.user)
}