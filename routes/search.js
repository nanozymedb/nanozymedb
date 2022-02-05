const express = require("express");
const router = express.Router();

const search = require("../controllers/search")
router.post("/search_query", search.postSearchResults)
router.get("/search_result", search.getSearchResults);

module.exports = router;
