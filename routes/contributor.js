const express = require("express");
const router = express.Router();

const contribute = require("../controllers/contribute");

router.get("/add-entry", contribute.getContributeEntry);
router.post("/add-entry", contribute.postContributeEntry);

module.exports = router;
