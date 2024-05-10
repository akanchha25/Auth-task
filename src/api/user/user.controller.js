const { hashedPassword } = require("../../utils/hashPassword");
const uploadOnCloudinary = require("../../config/cloudinary");

const User = require("../../models/user.model");

exports.getMyProfile = async (req, res) => {
  try {
    const user = req.user;

    const {
      _id,
      name,
      email,
      phoneNumber,
      lastLogin,
      bio,
      profilePicture,
      accountType,
      createdAt,
      updatedAt,
      __v,
    } = user;

    const userProfile = {
      _id,
      name,
      email,
      phoneNumber,
      lastLogin,
      bio,
      profilePicture,
      accountType,
      createdAt,
      updatedAt,
      __v,
    };

    res.status(200).json({
      message: `Profile data fetched successfully`,
      data: userProfile,
    });
  } catch (error) {
    console.error("Error in getMyProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProfileData = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const { name, email, phoneNumber, bio, password } = req.body;

    // Validation: Check if required fields are provided
    if (!name || !email || !phoneNumber || !password || !bio) {
      return res
        .status(400)
        .json({ message: "Name, email, and phone number are required" });
    }

    // Check if the email being updated already exists in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser.email !== userEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await hashedPassword(password);

    // Update user's profile data
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { name, email, phoneNumber, bio, password: hashPassword },
      { new: true }
    );

    // Check if user is found and updated successfully
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response with updated user data
    res
      .status(200)
      .json({ message: `User data updated successfully`, data: updatedUser });
  } catch (error) {
    console.error("Error in updateProfileData:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const cloudinaryResult = await uploadOnCloudinary(req.file.buffer);

    if (cloudinaryResult) {
      return res.status(200).json({ imageUrl: cloudinaryResult.secure_url });
    } else {
      return res.status(500).json({ error: "Failed to upload" });
    }
  } catch (error) {
    console.log("Error in uploadProfilePicture: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAccountType = async (req, res) => {
  try {
    const email = req.userEmail;
    const { accountType } = req.body;

    if (accountType != "private" || accountType != "public") {
      return res.status(400).json({ message: `Invalid account type.` });
    }

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: `User does not exists` });
    }

    // Update user's profile data
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { accountType: accountType },
      { new: true }
    );

    // Check if user is found and updated successfully
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: `Account updated successfully` });
  } catch (error) {
    console.error("Error in updateAccountType:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = req.user;
    const userDetails = await User.findOne({ _id: userId });
    if (!userDetails) {
      return res.status(404).json({ message: `user not exists` });
    }

    if (user.role == "user" && userDetails.accountType == "private") {
      return res.status(404).json({ message: `Account is private` });
    }

    return res
      .status(200)
      .json({ message: `Account fetched successfully`, userDetails });
  } catch (error) {
    console.error("Error in getProfileById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
