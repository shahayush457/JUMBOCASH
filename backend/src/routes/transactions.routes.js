const transactionsController = require("../controllers/transactions.controller");
const authenticate = require("../middlewares/isAuthenticated.jwt");
const router = require("express").Router();

/**
 * @route     GET /api/v1/transactions/
 * @desc      Get all the transactions done by the user sorted by latest
 * @access    Private
 */
router.get("/", authenticate, transactionsController.getTransactionsByUser);

/**
 * @route     POST /api/v1/transactions/
 * @desc      Create transaction added by the user
 * @access    Private
 */
router.post("/", authenticate, transactionsController.createTransactions);

/**
 * @route     GET /api/v1/transactions/:id
 * @desc      Get transaction by its id
 * @access    Private
 */
router.get("/:id", authenticate, transactionsController.getTransactionsById);

/**
 * @route     PATCH /api/v1/transactions/:id
 * @desc      Update transaction by its id
 * @access    Private
 */
router.patch("/:id", authenticate, transactionsController.updateTransaction);

module.exports = router;
