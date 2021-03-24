const Agenda = require("agenda");
const { db_url } = require("../config/config");
const log = require("../common/logger");

const connectionOpts = {
  db: { address: db_url, collection: "agendaJobs" }
};

const agenda = new Agenda(connectionOpts);

require("./sendReminder")(agenda);

agenda
  .start()
  .then(() => {
    log.info("Agenda scheduler started");
  })
  .catch(error => {
    log.error(error, "Not started scheduler ERROR! ");
  });

module.exports = agenda;
