const express = require("express")
const router = express.Router();

const middleware = require("../controllers/middleware");
const home = require("../controllers/home")
router.get("/home",middleware.isAuthenticated, home.getHomePage)

module.exports = router