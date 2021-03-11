const pino = require("pino");
const { app, log_enabled } = require("../config/config");

const log = pino({
  name: app,
  level: "info",
  enabled: !(log_enabled === "false")
});

module.exports = log;
