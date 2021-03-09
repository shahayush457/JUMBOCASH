const router = require("express").Router();

router.use("/auth", require("./auth/auth.routes"));

router.use("/oauth", require("./oauth/oauth.routes"));

router.use("/transactions", require("./transactions/transactions.routes"));

router.use("/entities", require("./entities/entities.routes"));

module.exports = router;
