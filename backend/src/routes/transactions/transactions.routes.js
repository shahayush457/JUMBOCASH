const transactionsController = require("../../controllers/transactions.controller");
const authenticate = require("../../middlewares/isAuthenticated.jwt");
const validator = require("../../utils/validators/validateTransactions");
const sanitiser = require("../../utils/sanitisers/sanitiseTransactions");
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
router.post(
  "/",
  authenticate,
  validator.validate("createTransactions"),
  sanitiser.sanitiseCreate,
  transactionsController.createTransactions
);

/**
 * @route     GET /api/v1/transactions/filter
 * @desc      Get transactions after applying filters/sorting/pagination
 * @access    Private
 */
router.get(
  "/filter",
  authenticate,
  validator.validate("getFilteredTransactions"),
  sanitiser.sanitiseFilter,
  transactionsController.getFilteredTransactions
);

/**
 * @route     GET /api/v1/transactions/:id
 * @desc      Get transaction by its id
 * @access    Private
 */
router.get(
  "/:id",
  authenticate,
  validator.validate("getTransactionsById"),
  transactionsController.getTransactionsById
);

/**
 * @route     PATCH /api/v1/transactions/:id
 * @desc      Update transaction by its id
 * @access    Private
 */
router.patch(
  "/:id",
  authenticate,
  validator.validate("updateTransaction"),
  sanitiser.sanitiseUpdate,
  transactionsController.updateTransaction
);

module.exports = router;
