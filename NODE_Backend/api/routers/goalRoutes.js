const express = require('express')
const router = express.Router()
const {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
} = require('../../api/controllers/goalController')

const { protect } = require('../../api/middleware/authMiddleware')

router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal)

module.exports = router
