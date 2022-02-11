const express = require("express");
const router = express.Router();
const editor = require("../controllers/editor");
const middleware = require("../controllers/middleware");
router.get(
  "/dashboard",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.getEditorDashboard
);
router.get(
  "/approved-entry",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.getEditorApprovedEntry
);
router.get(
  "/approve-entry/:nanozymeId",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.getNanozymeApprovalPage
);
router.get(
  "/unapproved-entries",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.getUnapprovedEntry
);
router.post(
  "/approve-entry/:nanozymeId",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.postNanozymeApprovalPage
);
router.get(
  "/unapproved-entry/:nanozymeId",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.deleteUnapprovedEntry
);

router.get(
  "/flagged-entries",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.getFlaggedEntries
);
router.get(
  "/flagged-entry-details/:flaggedEntry",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.getFlaggedEntryDetails
);
router.get(
  "/delete-flagged-entry/delete",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.deleteFlaggedEntry
);
router.post(
  "/update-flagged-entry/:flaggedEntry",
  [middleware.isAuthenticated, middleware.isEditor],
  editor.postFlaggedEntries
);
module.exports = router;
