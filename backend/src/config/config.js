const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
  app: process.env.APP_ID,
  port: process.env.PORT,
  db_url: process.env.DB_URL
};
