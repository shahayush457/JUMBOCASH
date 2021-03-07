const router = require("express").Router();
const handle = require("../../controllers/entity.controller");
const auth = require("../../middlewares/isAuthenticated.jwt");

/**
 * @route     GET /api/v1/entities
 * @desc      Get user entities
 * @access    Private
 */
router.get("/", auth, handle.userEntities);

/**
 * @route     POST /api/v1/entities
 * @desc      Add entity for a user
 * @access    Private
 */
router.post("/", auth, handle.createEntity);

/**
 * @route     GET /api/v1/entities/filter
 * @desc      Get entities after applying filters/sorting/pagination
 * @access    Private
 */
router.get("/filter", auth, handle.getFilteredEntity);

/**
 * @route     GET /api/v1/entities/:id
 * @desc      Get entities by its id
 * @access    Private
 */
router.get("/:id", auth, handle.getEntityById);

/**
 * @route     PATCH /api/v1/entities/:id
 * @desc      Update entity by its id
 * @access    Private
 */
router.patch("/:id", auth, handle.updateEntity);

module.exports = router;
