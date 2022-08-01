const express = require('express')
const router = express.Router()
const {
    getDonations,
    setGoal,
    updateGoal,
    deleteGoal,
} = require('../../api/controllers/donationController')

const { protect } = require('../../api/middleware/authMiddleware')

router.route('/').get(protect, getDonations).post(protect, setGoal)
router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal)

module.exports = router
