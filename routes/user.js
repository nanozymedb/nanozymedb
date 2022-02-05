const express = require("express");
const router = express.Router();

const user = require("../controllers/user");
router.post("/signup", user.createUser);
router.get("/verify-user/:token", user.verifyUser)