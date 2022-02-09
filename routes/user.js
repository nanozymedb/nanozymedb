const express = require("express");
const router = express.Router();
const user = require("../controllers/user");
const passport = require("passport");
const middleware = require("../controllers/middleware");

router.post("/signup", user.createUser);
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    // failureFlash: true,
    failureRedirect: "/user-gateway",
  })
);
// https://github.com/bradtraversy/node_passport_login
router.get("/verify-user/:token", user.verifyUser);
module.exports = router;
