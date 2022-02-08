exports.isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/home");
};
exports.isEditor = async (req, res, next) => {
  if (req.user.type == 1) {
    console.log(req.user);
    return next();
  }
};
exports.isAdmin = async (req, res, next) => {
  if (req.user.type == 2) {
    console.log(req.user);
    return next();
  }
};
