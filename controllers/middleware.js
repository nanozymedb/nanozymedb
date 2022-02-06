exports.isAuthenticated = async (req,res, next) =>{
    if(req.isAuthenticated()) return next();
    res.redirect("/")
}
exports.isEditor = async (req,res,next) =>{

}
exports.isAdmin = async (req,res,next) =>{

}