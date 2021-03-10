const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("../models/users.model");
const { clientId, clientSecret } = require("../config/config").oauth.facebook;

passport.use(
  "facebook-token",
  new FacebookTokenStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(accessToken);
        console.log(profile);

        // find user in db by email
        const userInDb = await User.findOne({ email: profile.emails[0].value });

        // if user already signed in using facebook
        if (userInDb && userInDb.method.includes("facebook", 0))
          return done(null, userInDb);

        // if user registered with some other method but not using facebook
        if (userInDb) {
          userInDb.method.push("facebook");
          await userInDb.save();
          return done(null, userInDb);
        }

        // if user is registering to the app for the first time
        const newUser = new User({
          method: ["facebook"],
          name: profile.displayName,
          email: profile.emails[0].value
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false, {
          status: 400,
          message: [{ msg: error.message }]
        });
      }
    }
  )
);
