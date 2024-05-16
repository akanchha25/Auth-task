const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const logger = require('../utils/logger')

const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization
    let token = auth

    if (auth.includes('Bearer')) {
      token = token.split(' ')[1]
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

    const userEmail = decodeToken.email
    const userRole = decodeToken.role

    const rootUser = await User.findOne({ email: userEmail })

    if (!rootUser) {
      throw new Error('User not found')
    }

    req.user = rootUser
    req.userId = decodeToken.userId
    req.userEmail = userEmail
    req.userRole = userRole
    next()
  } catch (error) {
    logger.error(error.message)

    if (error.name === 'TokenExpiredError') {
      res.status(403).json({ message: 'Token expired' })
    } else {
      res.status(401).json({ message: 'Invalid token' })
    }
  }
}

module.exports = authenticate
