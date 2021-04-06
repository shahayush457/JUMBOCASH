const router = require("express").Router();
const auth = require("../../middlewares/isAuthenticated.jwt");
const controlYear = require("../../controllers/reportsCurrentYear.controller");
const controlMonth = require("../../controllers/reportsCurrentMonth.controller");

/**
 * @route     GET /api/v1/reports/currentYear
 * @desc      Get reports data for current year
 * @access    Private
 */
router.get("/currentYear", auth, controlYear.getCurrentYearReport);

/**
 * @route     GET /api/v1/reports/currentMonth
 * @desc      Get reports data for current month
 * @access    Private
 */
router.get("/currentMonth", auth, controlMonth.getCurrentMonthReport);

module.exports = router;
