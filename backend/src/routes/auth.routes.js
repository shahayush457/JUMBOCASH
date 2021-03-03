const router = require("express").Router();
const handle = require("../controllers/auth.controller");

/**
 * @route     GET /api/v1
 * @desc      Get all users (for development only)
 * @access    Private
 */
router.get("/", handle.getUsers);

/**
 * @route     POST /api/v1/auth/register
 * @desc      Register to the site
 * @access    Public
 */
router.post("/register", handle.register);

/**
 * @route     POST /api/v1/auth/login
 * @desc      Login to the site
 * @access    Public
 */
router.post("/login", handle.login);

module.exports = router;
