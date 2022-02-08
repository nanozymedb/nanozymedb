const express = require("express");
const router = express.Router();

const middleware = require("../controllers/middleware");
const auth = require("../controllers/auth");
router.get(
  "/dashboard",
  middleware.isAuthenticated,
  auth.postRedirectedUserGateway,
  auth.getDashboard
);

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

module.exports = router;
