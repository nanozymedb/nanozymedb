const path = require("path");
const User = require("../models/User");
exports.getAdminDashboard = async (req, res) => {
  const user = await req.user;
  res.render(path.join("admin", "admin"), { user });
};
exports.getManageUserPage = async (req, res) => {
  let user = await req.user;
  var perPage = 20;
  var page = req.query.page || 1;
  User.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      User.count().exec((err, count) => {
        if (err) return next(err);
        data.length == 0
          ? res.json("Not found")
          : res.render(path.join("admin", "manageusers"), {
              user,
              data: data,
              current: page,
              pages: Math.ceil(count / perPage),
            });
        // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
      });
    });
};
exports.postAdminUserSearchPage = async (req, res) => {
  await res.clearCookie();
  await res.cookie("admin", { userEmail: req.body.userEmail });
  await res.redirect("/admin/search-user-results");
};
exports.getSearchResults = async (req, res) => {
  if (req.cookies.admin == undefined) {
    await res.redirect("/admin/dashboard");
  }
  let user = await req.user;
  const { userEmail } = await req.cookies.admin;
  let queryUser = await User.find({ email: { $regex: userEmail } });
  if (!queryUser) res.redirect("/admin/manage-users");
  await res.render(path.join("admin", "searchresults"), {
    user,
    queryUser,
    userEmail,
  });
};
exports.getAdminUserSearchPage = async (req, res) => {
  await res.clearCookie();
  let user = req.user;
  res.render(path.join("admin", "usersearch"), { user });
};
exports.getUserDetailsPage = async (req, res) => {
  let user = await req.user;
  let userId = await req.params.userId;
  let queryUser = await User.findById(userId);
  if (!queryUser) res.redirect("/admin/dashboard");
  res.render(path.join("admin", "userdetails"), { user, queryUser });
};

exports.postChangeUserDetails = async (req, res) => {
  const { fName, lName, email, status, type } = await req.body;
  const userId = await req.params.userId;
  try {
    await User.findByIdAndUpdate(userId, {
      fName: fName,
      lName: lName,
      email: email,
      status: status,
      type: type,
    });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
  }
};
exports.deleteUser = async (req, res) => {
  const userId = await req.params.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
  }
};
