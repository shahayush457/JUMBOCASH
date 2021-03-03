const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mongo");
const { port } = require("../config/config");
const log = require("./logger");

const oauthRoutes = require("../routes/oauth.routes");
const transactionRoutes = require("../routes/transactions.routes");
const authRoutes = require("../routes/auth.routes");
const entityRoutes = require("../routes/entities.routes");
const errorhandler = require("../controllers/error.controller");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// requests related to OAuth authentication
app.use("/api/v1/oauth", oauthRoutes);

// requests related to password based authentication
app.use("/api/v1/auth", authRoutes);

// requests related to user transactions
app.use("/api/v1/transactions", transactionRoutes);

// requests related to user entities
app.use("/api/v1/entities", entityRoutes);

// Invalid route's error handling
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorhandler.error);

app.listen(port, () => {
  log.info(`Server up and running on port ${port}...`);
});

module.exports = app; // for testing
