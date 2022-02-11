exports.isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/home");
};
exports.isEditor = async (req, res, next) => {
  if (req.user.type == 1) {
    return next();
  }
  res.redirect("/dashboard");
};
exports.isAdmin = async (req, res, next) => {
  if (req.user.type == 2) {
    return next();
  }
  res.redirect("/dashboard");
};
// exports.redirectUserType = async (req, res, next) => {
//   let userType = req.user.type;
//   if (userType == 2) {
//     res.redirect("/admin/dashboard");
//   } else if (userType == 1) {
//     res.redirect("/editor/dashboard");
//   } else {
//     res.redirect("/dashboard");
//   }
//   next();
// };
