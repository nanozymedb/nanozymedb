const path = require("path");
const User = require("../models/User");
const Nanozyme = require("../models/Nanozyme");
const Contact = require("../models/Contact");

const FlaggedEntry = require("../models/FlaggedEntry");

exports.getAdminDashboard = async (req, res) => {
  await res.clearCookie("admin");

  const user = await req.user;
  const nanozymes = await Nanozyme.find();
  const contacts = await Contact.find();

  const approvedNanozymes = await Nanozyme.find({ approved: 1 });
  const unapprovedNanozymes = await Nanozyme.find({ approved: 0 });
  const flaggedEntries = await FlaggedEntry.find();
  const userCount = await User.find({ type: 0 });
  const editorCount = await User.find({ type: 1 });
  const adminCount = await User.find({ type: 2 });

  await res.render(path.join("admin", "admin"), {
    user,
    nanozymes,
    approvedNanozymes,
    unapprovedNanozymes,
    flaggedEntries,
    userCount,
    editorCount,
    adminCount,
    contacts,
  });
};
exports.getManageUserPage = async (req, res) => {
  await res.clearCookie("admin");

  let user = await req.user;
  var perPage = 20;
  var page = req.query.page || 1;
  let totalentries = User.find();
  let entries = totalentries.length;
  User.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      User.count().exec((err, count) => {
        if (err) return next(err);
        res.render(path.join("admin", "manageusers"), {
          user,
          entries,
          data: data,
          current: page,
          pages: Math.ceil(count / perPage),
        });
        // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
      });
    });
};
exports.postAdminUserSearchPage = async (req, res) => {
  await res.clearCookie("admin");
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
  const { fName, lName, email, status, type, userPosition } = await req.body;
  const userId = await req.params.userId;
  try {
    const typeNumber = parseInt(type);
    await User.findByIdAndUpdate(userId, {
      fName: fName,
      lName: lName,
      email: email,
      status: status,
      userPosition: userPosition,
      type: typeNumber,
    });
    req.flash("success_msg", "Changed User Details");
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
  }
};
exports.deleteUser = async (req, res) => {
  const userId = await req.params.userId;
  try {
    await User.findByIdAndDelete(userId);
    await req.flash("success_msg", "User Deleted");
    await res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
  }
};
exports.getEditors = async (req, res) => {
  let user = req.user;
  let editors = User.find({ type: 1 });
  var perPage = 20;
  var page = req.query.page || 1;
  User.find({ type: 1 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      User.count().exec((err, count) => {
        if (err) return next(err);
        // data.length == 0
        // ? res.json("Not found")
        // :
        res.render(path.join("admin", "editors"), {
          user,
          editors,
          data: data,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    });
  res.render;
};
exports.getEditorDetails = async (req, res) => {
  let user = await req.user;
  let editorId = await req.params.editorId;
  let queryEditor = await User.findById(editorId);
  if (!queryEditor) res.redirect("/admin/dashboard");
  res.render(path.join("admin", "editordetails"), { user, queryEditor });
};
exports.getContactResponsePage = async (req, res) => {
  let user = await req.user;
  var perPage = 20;
  var page = req.query.page || 1;
  let totalentries = Contact.find();
  let entries = totalentries.length;
  Contact.find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      Contact.count().exec((err, count) => {
        if (err) return next(err);
        res.render(path.join("admin", "contactresponse"), {
          user,
          entries,
          data: data,
          current: page,
          pages: Math.ceil(count / perPage),
        });
        // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
      });
    });
};
exports.getContactResponseInfoPage = async (req, res) => {
  let user = await req.user;
  let contactId = await req.params.id;
  let queryContact = await Contact.findById(contactId);
  if (!queryContact) res.redirect("/admin/dashboard");
  res.render(path.join("admin", "contactresponseinfo"), { user, queryContact });
};
exports.deleteContactResponse = async (req, res) => {
  const id = await req.params.id;
  try {
    await Contact.findByIdAndDelete(id);
    await req.flash("success_msg", "Deleted Successfully");
    await res.redirect("/admin/dashboard");
  } catch (error) {
    console.error(error);
  }
};
