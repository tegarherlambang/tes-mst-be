const express = require('express')
const router = express.Router()
const tokenMiddleware = require('./middleware/tokenMiddleware')
const { upload } = require('./middleware/uploadMiddleware')

const AuthController = require('./controller/AuthController')
const UserController = require('./controller/UserController')

router.post("/auth/login", AuthController.login)
router.post("/auth/register", upload.uploadImage.single('file'), AuthController.register)
router.put("/auth/activate-user", AuthController.activateUser)
router.post("/auth/forgot-password", AuthController.forgotPassword)
router.post("/auth/reset-password", AuthController.resetPassword)

router.put("/user/change-photo", [tokenMiddleware.verifyToken, upload.uploadImage.single('file')], UserController.changePhoto)
module.exports = router