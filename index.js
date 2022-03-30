const express = require("express");
var path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const bodyParser = require("body-parser");
mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/btp",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB Connected");
  }
);

// Routes
const contributorRoute = require("./routes/contributor");
const searchRoute = require("./routes/search");
const userRoute = require("./routes/user");
const mainRoute = require("./routes/main");
const authRoute = require("./routes/auth");
const editorRoute = require("./routes/editor");
const adminRoute = require("./routes/admin");

// Middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Login Route
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
app.use("/contribute", contributorRoute);
app.use("/", [userRoute, authRoute, mainRoute, searchRoute]);
app.use("/editor", editorRoute);
app.use("/admin", adminRoute);

app.use(express.static(path.join(__dirname, "/client/public")));
app.set("views", path.join(__dirname, "./client/views"));
app.set("view engine", "ejs");
app.get("*", (req, res) => {
  res.status(404).redirect("/home");
});
app.listen(4400, () => {
  console.log("Server Running");
});
