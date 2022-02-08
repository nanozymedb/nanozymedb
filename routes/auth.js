const express = require("express");
const router = express.Router();

const middleware = require("../controllers/middleware");
const auth = require("../controllers/auth");
router.get(
  "/dashboard",
  [
    middleware.isAuthenticated,
    middleware.postRedirectedUserGateway,
    middleware.redirectUserType,
  ],
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
router.get("/signout", middleware.isAuthenticated, auth.signoutUser);
module.exports = router;
