const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const passport = require("passport");

router.post("/signup", user.createUser);
router.post("/signin", [
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureFlash: true,
    failureRedirect: "/user-gateway",
  }),
]);
// https://github.com/bradtraversy/node_passport_login
router.get("/verify-user/:token", user.verifyUser);
router.get("/forgot-password", user.getforgotPassword);
router.post("/forgot-password", user.postforgotPassword);
router.get("/reset-password", (req, res) => {
  res.redirect("/home");
});
router.get("/reset-password/:resetToken", user.getResetPassword);
router.post("/reset-password/:resetToken", user.postResetPassword);

router.get("/unauth/raise-flag",user.redirectUnauthRaiseFlag)
router.post("/signin/redirect", [
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user-gateway",
  }),
], user.postUnauthFlagPage);

module.exports = router;
