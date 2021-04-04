const router = require("express").Router();
const auth = require("../../middlewares/isAuthenticated.jwt");
const control = require("../../controllers/reports.controller");

/**
 * @route     GET /api/v1/reports/currentYear
 * @desc      Get reports data for current year
 * @access    Private
 */
router.get("/currentYear", auth, control.getCurrentYearReport);

module.exports = router;
