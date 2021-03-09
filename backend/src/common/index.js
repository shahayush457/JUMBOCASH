const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mongo");
const { port } = require("../config/config");
const log = require("./logger");

const rootRouter = require("../routes/index.routes");
const errorhandler = require("../controllers/error.controller");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Root endpoint for all requests
app.use("/api/v1", rootRouter);

// Invalid route's error handling
app.use((_, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorhandler.error);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    log.info(`Server up and running on port ${port}...`);
  });
}

module.exports = app; // for testing
