const passport = require("passport");
const googleMiddleware = require("../middlewares/passportGoogle");
const googleController = require("../controllers/googleAuth.controller");
const router = require("express").Router();

/**
 * @route     POST /api/v1/auth/google
 * @desc      Sign in with google
 * @access    Private
 */
router.post(
  "/google",
  passport.authenticate(
    "google-token",
    { session: false },
    googleController.googleOAuth
  )
);

/**
 * @route     POST /api/v1/auth/facebook
 * @desc      Sign in with facebook
 * @access    Private
 */

module.exports = router;
