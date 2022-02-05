const User = require("../models/User")
const bcrypt = require("bcrypt")
const crypto = require("crypto");
exports.createUser = async (req,res)=>{
    const {fName, lName, email, password} = req.body;
    let user = await User.findOne({email: email})
    if(user) {
        res.json("User exists")
    }
    const token = await crypto.randomBytes(32).toString("hex");
    try {
        bcrypt.hash(password, 8, async (err, hashedPassword) => {
            password = await hashedPassword;
        });
        try {
            user = await new User({
                fName: fName,
                lName: lName,
                email: email,
                password: password,
                token: token
            })
            await user.save()
        } catch (error) {
            console.error([error, "Error in createUser block 1"])
        }
    } catch (error) {
        console.error([error, "Error in createUser block 2"])
        
    }
}