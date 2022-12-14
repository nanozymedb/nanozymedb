const express = require("express");
const router = express.Router();

const search = require("../controllers/search");
router.post("/search_query", search.postSearchResults);
router.get("/search_result", search.getSearchResults);
router.post("/filter_search_query", search.filterSearchResults);
router.get("/remove-filters", search.removeFilters);
router.get("/all_results", search.getAllResults);
module.exports = router;
