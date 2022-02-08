const express = require("express");
const router = express.Router();
const editor = require("../controllers/editor");
const middleware = require("../controllers/middleware");
router.get(
  "/dashboard",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.getEditorDashboard
);

module.exports = router;
