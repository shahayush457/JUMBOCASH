const passport = require("passport");
const googleMiddleware = require("../middlewares/passportGoogle");
const googleController = require("../controllers/googleAuth.controller");
const router = require("express").Router();

/**
 * @route     POST /api/v1/oauth/google
 * @desc      Sign in with google
 * @access    Public
 */
router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  googleController.googleOAuth
);

/**
 * @route     POST /api/v1/oauth/facebook
 * @desc      Sign in with facebook
 * @access    Public
 */

module.exports = router;
