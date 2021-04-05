const router = require("express").Router();

router.use("/auth", require("./auth/auth.routes"));

router.use("/oauth", require("./oauth/oauth.routes"));

router.use("/transactions", require("./transactions/transactions.routes"));

router.use("/entities", require("./entities/entities.routes"));

router.use("/insights", require("./insights/insights.routes"));

router.use("/reports", require("./reports/reports.routes"));

module.exports = router;
