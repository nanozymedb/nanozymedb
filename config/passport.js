const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");
module.exports = async (passport) => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Invalid Credentials" });
        }
        bcrypt.compare(password, user.password, async (err, res) => {
          if (err) return done(err);
          if (res === false) {
            return done(null, false, { message: "Invalid Credentials" });
          } else {
            if (user.status === "Active") {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Please verify your email address",
              });
            }
          }
        });
      });
    })
  );
  passport.serializeUser(async (user, done) => {
    await done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
