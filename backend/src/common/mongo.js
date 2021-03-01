const mongoose = require("mongoose");
const log = require("./logger");
const { db_url } = require("../config/config");

const url = db_url;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    log.info("Connected to Database");
  })
  .catch(error => {
    log.error(error, "Not Connected to Database ERROR! ");
  });