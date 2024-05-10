const bcrypt = require("bcryptjs");

// function to hash the password
async function hashedPassword(password) {
  const salt = bcrypt.genSaltSync(6);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

module.exports = {
  hashedPassword,
};
