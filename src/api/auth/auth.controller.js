//const { ApiError } = require("../../../error/ApiError");
const authService = require("./auth.service");
const User = require("../../models/user.model");
const { hashedPassword } = require("../../utils/hashPassword");
const { generateAccessToken } = require("../../utils/jwtHelper");
const logger = require("../../utils/logger");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    const { authType, name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res
        .status(422)
        .json({ message: `Please fill the required details!` });
    }
    let token;
    if (authType === "EMAIL") {
      const existingUser = await authService.getUserByEmail(email);
      if (existingUser) {
        return res.status(422).json({ message: "User already exist" });
      }
      const hashPassword = await hashedPassword(password);
      const newUser = new User({
        name,
        email,
        password: hashPassword,
        phoneNumber,
        role: role ? role : "user",
      });
      const saveUser = await newUser.save();

      const userId = saveUser._id;
      token = generateAccessToken(email, role, userId);

      res.cookie("jwt_token", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: false,
      });
    }

    return res.status(200).json({
      message: `User registered successfully`,
      user: {
        token,
      },
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: `Internal server error` });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password, authType } = req.body;

    if (!email || !password || !authType) {
      return res.status(400).json({ message: "Insufficient data" });
    }
    if (authType == "EMAIL") {
      const userDetails = await User.findOne({ email });
      if (userDetails) {
        const isMatch = await bcrypt.compare(password, userDetails.password);

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        email = userDetails.email;
        const role = userDetails.role;

        const userId = userDetails._id;

        token = generateAccessToken(email, role, userId);
        res.cookie("jwt_token", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: false,
        });
        userDetails.lastLogin = new Date();
        await userDetails.save();
        return res.status(200).json({
          message: "User logged in successfully",
          user: {
            userId: userDetails._id,
          },
          token,
        });
      } else {
        return res.status(400).json({ message: "Invalid credential" });
      }
    } else {
      return res.status(402).json({ message: `Invalid` });
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({ message: `Internal server error` });
  }
};

exports.signOut = async (req, res) => {
  try {
    req.logout(); // Clear the user's session
    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
