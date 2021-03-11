const router = require("express").Router();
const handle = require("../../controllers/auth.controller");
const auth = require("../../middlewares/isAuthenticated.jwt")
const validator = require("../../utils/validators/validateAuth");
const sanitiser = require("../../utils/sanitisers/sanitiseAuth");

/**
 * @route     GET /api/v1
 * @desc      Get all users (for development only)
 * @access    Public
 */
router.get("/", handle.getUsers);

/**
 * @route     GET /api/v1/user
 * @desc      Get all users (for development only)
 * @access    Private
 */
 router.get("/user", auth,handle.getUserbyId);

/**
 * @route     POST /api/v1/auth/register
 * @desc      Register to the site
 * @access    Public
 */
router.post("/register", validator.validate("register"), sanitiser.sanitiseRegister, handle.register);

/**
 * @route     POST /api/v1/auth/login
 * @desc      Login to the site
 * @access    Public
 */
router.post("/login", validator.validate("login"), handle.login);

module.exports = router;
