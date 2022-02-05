const express = require("express");
const router = express.Router();

const contribute = require("../controllers/contribute");

router.get("/add_entry", contribute.getContributeEntry);
router.post("/add_entry", contribute.postContributeEntry);

module.exports = router;
