const express = require("express")
const router = express.Router();

const middleware = require("../controllers/middleware");
const auth = require("../controllers/auth")
router.get("/dashboard",middleware.isAuthenticated, auth.getDashboard)
module.exports = router