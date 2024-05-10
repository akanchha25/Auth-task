// platform.router.js
const express = require('express')
const router = express.Router()

const auth = require('./api/auth/auth.router')
const user = require('./api/user/user.router')


router.use('/', auth)
router.use('/',user)



router.get('/', (req, res) => {
  res.send('Welcome to the Platform Server!')
})

module.exports = router
