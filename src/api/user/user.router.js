const express = require('express')
const userController = require('../user/user.controller')
const Authenticate = require('../../middleware/authCheck')

const upload = require("../../middleware/multer")

const router = express.Router()

// api to view my profile
router.get('/profile', Authenticate, userController.getMyProfile)

// api to update profile data
router.post('/update/data', Authenticate, userController.updateProfileData)

// api to update profile picture
router.post('/upload/profile/picture', Authenticate, upload.single("file"), userController.updateProfilePicture)

// api to get user detail
router.get('/user/:userId', Authenticate, userController.getProfileById)

// api to change account type like public or private
router.post('/update/account', Authenticate, userController.updateAccountType)




  




module.exports = router