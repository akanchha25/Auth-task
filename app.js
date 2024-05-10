require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { CORS_ORIGIN } = require("./envvar");
const { connectDB } = require("./src/config/dbConnection");
const platformRouter = require("./src/platformRouter");
const passport = require("passport");
const session = require("express-session");

require("./src/utils/passportAuth");

//const platformRouter = require('./platform.router')

// Middleware setup
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// database connection
connectDB();

app.get("/", (req, res) => {
  res.send("Hello, Server is running");
});

app.use("/v1", platformRouter);

// Login and register with google

app.use(
  session({
    secret: "Shh, its a secret!",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/authenticate/google", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/authenticated",
    failureRedirect: "/failed",
  })
);

app.get("/authenticated", (req, res) => {
    const userId = req.user.user.googleId; // Assuming googleId is the field storing the unique identifier for the user
    
    res.send(`{ "message" : "User Authenticated successfully",  "user": {
        "userId": ${req.user.user._id}
    }, "token": ${req.user.token}}`);
});

app.get("/failed", (req, res) => {
  res.send("Failed to authenticate");
});

module.exports = app;
