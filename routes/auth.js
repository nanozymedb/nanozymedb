const express = require("express");
const router = express.Router();

const middleware = require("../controllers/middleware");
const auth = require("../controllers/auth");
router.get("/dashboard", [middleware.isAuthenticated, auth.getDashboard]);

router.get(
  "/nanozyme/raise-flag/:nanozymeId",
  middleware.isAuthenticated,
  auth.getRaiseFlag
);

router.post(
  "/nanozyme/raise-flag/:nanozymeId",
  middleware.isAuthenticated,
  auth.postRaiseFlag
);
router.get(
  "/user/change-password",
  middleware.isAuthenticated,
  auth.getChangePassword
);
router.get(
  "/contributions",
  middleware.isAuthenticated,
  auth.getContributionPage
);
router.post(
  "/user/change-password",
  middleware.isAuthenticated,
  auth.postchangePassword
);
router.get("/signout", middleware.isAuthenticated, auth.signoutUser);
module.exports = router;
