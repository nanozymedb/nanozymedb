const express = require("express");
const router = express.Router();
const middleware = require("../controllers/middleware");
const admin = require("../controllers/admin");
router.get(
  "/dashboard",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.getAdminDashboard
);
router.get(
  "/manage-users",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.getManageUserPage
);
router.post(
  "/search-user-query",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.postAdminUserSearchPage
);
router.get(
  "/search-user-results",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.getSearchResults
);
router.get(
  "/search-users",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.getAdminUserSearchPage
);
router.get(
  "/manage-user/:userId",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.getUserDetailsPage
);
router.post(
  "/change-user-details/:userId",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.postChangeUserDetails
);
router.get(
  "/delete-user/:userId",
  [middleware.isAuthenticated, middleware.isAdmin],
  admin.deleteUser
);
module.exports = router;
