const express = require("express");
const router = express.Router();

const contribute = require("../controllers/contribute");
const middleware = require("../controllers/middleware");
router.get(
  "/add-entry",
  middleware.isAuthenticated,
  contribute.getContributeEntry
);
router.post(
  "/add-entry",
  middleware.isAuthenticated,
  contribute.postContributeEntry
);

module.exports = router;
