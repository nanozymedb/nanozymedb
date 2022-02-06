const express = require("express");
var path = require("path");
const mongoose = require("mongoose");
const session = require("express-session")
const cookieParser = require("cookie-parser");
const passport = require("passport");

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
// Middleware
const app = express();
app.use(express.json({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");

// Login Route
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport)
app.use("/", searchRoute);
app.use("/", mainRoute);
app.use("/contribute", contributorRoute);
app.use("/",userRoute)
app.listen(4400, () => {
  console.log("Server Running");
});
