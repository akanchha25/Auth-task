const User = require("../../models/user.model");
exports.getUserByEmail = async (email) => {
  try {
    const userDetail = User.findOne({ email });
    return userDetail;
  } catch (error) {
    throw error;
  }
};
