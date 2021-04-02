const router = require("express").Router();
const auth = require("../../middlewares/isAuthenticated.jwt");
const control = require("../../controllers/insights.controller");

/**
 * @route     GET /api/v1/insights
 * @desc      Get user insights
 * @access    Private
 */
router.get("/", auth, control.userInsights);

module.exports = router;