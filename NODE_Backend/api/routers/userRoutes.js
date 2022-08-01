const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
} = require('../../api/controllers/userController')
const { protect } = require('../../api/middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router
