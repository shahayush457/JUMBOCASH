const pino = require("pino");
const { app } = require("../config/config");

const log = pino({
  name: app,
  level: "info"
});

module.exports = log;
