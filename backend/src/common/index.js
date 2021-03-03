const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mongo");
const { port } = require("../config/config");
const log = require("./logger");
const userRoutes = require("../routes/users.routes");
const transactionRoutes = require("../routes/transactions.routes");


const authRoutes = require("../routes/auth.routes")
const entityRoutes = require("../routes/entities.routes")
const errorhandle = require("../controllers/error.controller")


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// requests related to authentication
app.use("/api/v1/auth", userRoutes);

// requests related to user transactions
app.use("/api/v1/transactions", transactionRoutes);

app.use('/auth', authRoutes);
app.use('/entities',entityRoutes);


app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(errorhandle.error);
//console.log(port);

app.listen(port, () => {
  log.info(`Server up and running on port ${port}...`);
});

module.exports = app; // for testing
