const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const db = require("../database/dbQueries");
const { clientId, clientSecret } = require("../config/config").oauth.google;

passport.use(
  "google-token",
  new GooglePlusTokenStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);

        // find user in db by email
        const userInDb = await db.findOneDocument(
          "user",
          { email: profile.emails[0].value },
          false
        );

        // if user already signed in using google
        if (userInDb && userInDb.method.includes("google", 0))
          return done(null, userInDb);

        // if user registered with some other method but not using google
        if (userInDb) {
          userInDb.method.push("google");
          await db.updateData(userInDb);
          return done(null, userInDb);
        }

        // if user is registering to the app for the first time
        const newUser = await db.createData("user", {
          method: ["google"],
          name: profile.displayName,
          email: profile.emails[0].value
        });

        done(null, newUser);
      } catch (err) {
        done(err, false, {
          status: 400,
          message: [{ msg: err.message }]
        });
      }
    }
  )
);
