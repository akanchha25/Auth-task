const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const { generateAccessToken } = require("../utils/jwtHelper");

passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });;


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            // User already exists in the database
            const userId = existingUser._id;
            const email = existingUser.email;
            const role = "user";

            const token = generateAccessToken(email, role, userId);
            done(null, { user: existingUser, token });
          } else {
            // Create a new user and save it to the database
            const newUser = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            });
            newUser
              .save()
              .then((user) => {
                const userId = user._id;
                const email = profile.emails[0].value;
                const role = "user";

                const token = generateAccessToken(email, role, userId);
                done(null, { user, token });
              })
              .catch((error) => {
                done(error, null);
              });
          }
        })
        .catch((error) => {
          done(error, null);
        });
    }
  )
);
