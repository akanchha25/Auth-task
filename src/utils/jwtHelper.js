const jwt = require('jsonwebtoken')

module.exports.generateAccessToken = function generateAccessToken (
  email,
  role,
  userId,
) {
  const jwtSecretKey = process.env.JWT_SECRET_KEY
  const expiresIn = '7d'

  const token = jwt.sign({ email, role, userId }, jwtSecretKey, {
    expiresIn
  })
  return token
}