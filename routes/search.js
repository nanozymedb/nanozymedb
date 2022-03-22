const express = require("express");
const router = express.Router();

const search = require("../controllers/search");
router.post("/search_query", search.postSearchResults);
router.get("/search_result", search.getSearchResults);
router.post("/filter_search_query", search.filterSearchResults);
module.exports = router;
