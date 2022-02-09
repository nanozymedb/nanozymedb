const express = require("express");
const router = express.Router();

const main = require("../controllers/main");

router.get("/home", main.getHomePage);
router.get("/user-gateway", main.getUserGateway);
router.get("/search", main.getSearchPage);
router.get("/nanozyme/:nanozymeId", main.getNanozymePage);
module.exports = router;
