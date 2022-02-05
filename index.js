const express = require("express");
var path = require("path");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
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
// Middleware
const app = express();
app.use(express.json({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use("/", searchRoute);
app.use("/contribute", contributorRoute);

app.listen(4400, () => {
  console.log("Server Running");
});
