const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mongo");
const { port } = require("../config/config");
const log = require("./logger");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.listen(port, () => {
  log.info(`Server up and running on port ${port}...`);
});

module.exports = app; // for testing
