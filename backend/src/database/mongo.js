const mongoose = require("mongoose");
const log = require("../common/logger");
const { db_url } = require("../config/config");

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true
  })
  .then(() => {
    log.info("Connected to Database");
  })
  .catch(error => {
    log.error(error, "Not Connected to Database ERROR! ");
  });
