const express = require('express')
const authController = require('../auth/auth.controller')
const Authenticate = require('../../middleware/authCheck')

const router = express.Router()

// API endpoints
router.post('/sign-up', authController.signUp)
router.post('/sign-in', authController.login)
router.post('/sign-out', Authenticate, authController.signOut)



module.exports = router