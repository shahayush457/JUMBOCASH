const Agenda = require("agenda");
const { db_url } = require("../config/config");
const log = require("../common/logger");

// Agenda will use the given mongodb connection to persist data, so jobs
// will go in the database with the url "db_url" "agendaJobs" collection.
const connectionOpts = {
  db: { address: db_url, collection: "agendaJobs" }
};

const agenda = new Agenda(connectionOpts);

require("./sendReminder")(agenda);

// `start()` is how you tell agenda to start processing jobs. If you just
// want to produce (AKA schedule) jobs then don't call `start()`
agenda
  .start()
  .then(() => {
    log.info("Agenda scheduler started");
  })
  .catch(error => {
    log.error(error, "Not started scheduler ERROR! ");
  });

module.exports = agenda;
