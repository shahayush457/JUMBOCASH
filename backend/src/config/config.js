const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
  app: process.env.APP_ID,
  port: process.env.PORT,
  log_enabled: process.env.LOG_ENABLED,
  db_url: process.env.DB_URL,
  jwt_secret: process.env.JWT_SECRET,
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }
  }
};
