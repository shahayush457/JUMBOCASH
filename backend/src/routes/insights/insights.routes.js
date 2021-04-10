const router = require("express").Router();
const auth = require("../../middlewares/isAuthenticated.jwt");
const control = require("../../controllers/insights.controller");
const sanitiser = require("../../utils/sanitisers/sanitiseInsights");

/**
 * @route     GET /api/v1/insights
 * @desc      Get user insights
 * @access    Private
 */
router.get("/", auth, sanitiser.sanitiseInsights, control.userInsights);

module.exports = router;
