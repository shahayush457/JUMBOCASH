const router = require("express").Router();
const auth = require("../../middlewares/isAuthenticated.jwt");
const controlYear = require("../../controllers/reportsCurrentYear.controller");
const controlMonth = require("../../controllers/reportsCurrentMonth.controller");
const controlWeek = require("../../controllers/reportsCurrentWeek.controller");

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

/**
 * @route     GET /api/v1/reports/currentWeek
 * @desc      Get reports data for current week
 * @access    Private
 */
router.get("/currentWeek", auth, controlWeek.getCurrentWeekReport);

module.exports = router;
