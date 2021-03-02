const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const config = require("../config/config");
const User = require("../models/users.model");

passport.use(
  "google-token",
  new GooglePlusTokenStrategy(
    {
      clientID: config.oauth.google.clientId,
      clientSecret: config.oauth.google.clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // find user in db by email
        const userInDb = await User.findOne({ email: profile.emails[0].value });

        // if user already signed in using google
        if (userInDb && userInDb.methods.includes("google", 0)) {
          return done(null, userInDb);
        }

        // if user signed in with some other method but not using google
        if (userInDb) {
          userInDb.methods.push("google");
          await userInDb.save();
          return done(null, userInDb);
        }

        // if user is signing in to the app for the first time
        const newUser = new User({
          method: ["google"],
          name: profile.displayName,
          email: profile.emails[0].value
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false, err.message);
      }
    }
  )
);
