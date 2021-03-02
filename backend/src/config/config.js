const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
  app: process.env.APP_ID,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_secret: process.env.jwt,
  oauth: {
    google: {
      clientId: process.env.google_clientId,
      clientSecret: process.env.google_clientSecret
    },
    facebook: {
      clientId: process.env.facebook_clientId,
      clientSecret: process.env.facebook_clientSecret
    }
  }
};
