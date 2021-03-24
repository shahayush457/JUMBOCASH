const passport = require("passport");
const googleMiddleware = require("../../middlewares/passportGoogle");
const facebookMiddleware = require("../../middlewares/passportFacebook");
const oauthController = require("../../controllers/OAuth.controller");
const authenticate = require("../../middlewares/isAuthenticated.jwt");
const router = require("express").Router();

/**
 * @route     POST /api/v1/oauth/google
 * @desc      Sign in with google
 * @access    Public
 */

router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  oauthController.OAuth
);

/**
 * @route     POST /api/v1/oauth/facebook
 * @desc      Sign in with facebook
 * @access    Public
 */

router.post(
  "/facebook",
  passport.authenticate("facebook-token", { session: false }),
  oauthController.OAuth
);

/**
 * @route     DELETE /api/v1/oauth/facebook
 * @desc      DELETE facebook data
 * @access    Private
 */

router.delete("/facebook", authenticate, oauthController.deleteOAuthFb);

module.exports = router;
