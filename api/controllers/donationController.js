const asyncHandler = require('express-async-handler')
var mongoose = require('mongoose');
const Goal = require('../../models/goalModel')
const User = require('../../models/People')
const { ObjectId } = require('mongodb');
const Donation = require('../../models/Donation')
// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getDonationss = asyncHandler(async (req, res) => {
  // var id = mongoose.Types.ObjectId(req.user.id);
  const donations = await Donation.find({ member_id: req.user.id })

  res.status(200).json(donations)

})

const getDonations = asyncHandler(async (req, res) => {
  // const donations = await Donation.find({ member_id: req.user.id })
  let installAmount = process.env.MONTHLY_PAYMENT;
  try {
  
    let restPeyment;
    const member_id = ObjectId(req.user.id);

    let countDonation = await Donation.aggregate([
      //    { $match: { member_id: member_id } },
      { $match: { $and: [{ member_id: { $eq: member_id } }, { paymenttype: { $eq: "Monthly" } }] } },
      {
        $group: {
          // Each `_id` must be unique, so if there are multiple
          // documents with the same age, MongoDB will increment `count`.
          _id: null,
          totalAmount: { $sum: "$payment" },
        }
      },
      { "$limit": 1 }
    ]);

    const donations = await Donation.find({
      member_id: req.user.id,
      paymenttype: 'Monthly'
    }).limit(100).sort({ $natural: -1 });


    const lastDonation = await Donation.findOne({
      member_id: req.user.id,
      paymenttype: 'Monthly'
    }).limit(1).sort({ $natural: -1 });

    //res.status(200).json({ donations, data: countDonation })
    
    if (countDonation.length > 0) {
      restPeyment = (countDonation[0]['totalAmount'] % installAmount)
    }


    res.status(200).json({    
       donations,
       lastDonation,
       countDonation,
       restPeyment
    })

  } catch (error) {

  }



})
const getDonations3 = asyncHandler(async (req, res) => {



  try {
    const user = await User.findOne({
      _id: req.user.id,
    });



    let restPeyment;
    const member_id = ObjectId(req.query.id);

    let countDonation = await Donation.aggregate([
      //    { $match: { member_id: member_id } },
      { $match: { $and: [{ member_id: { $eq: member_id } }, { paymenttype: { $eq: "Monthly" } }] } },
      {
        $group: {
          // Each `_id` must be unique, so if there are multiple
          // documents with the same age, MongoDB will increment `count`.
          _id: null,
          totalAmount: { $sum: "$payment" },
        }
      },
      { "$limit": 1 }
    ]);







    // const totSum = await Donation.count({ _id: req.query.id });

    const donations = await Donation.find({
      member_id: req.query.id,
      paymenttype: 'Monthly'
    }).limit(100).sort({ $natural: -1 });



    const lastDonation = await Donation.findOne({
      member_id: req.query.id,
      paymenttype: 'Monthly'
    }).limit(1).sort({ $natural: -1 });


    const users = await User.find();

    let installAmount = process.env.MONTHLY_PAYMENT;

    if (countDonation.length > 0) {
      restPeyment = (countDonation[0]['totalAmount'] % installAmount)
    }

    // res.status(200).json({ id: req.params.id })
    res.status(200).json({
      user: user,
      donations: donations,
      lastDonation: lastDonation,
      totoDonation: countDonation,
      restAmount: restPeyment

    })

  } catch (err) {
    res.status(400)
    throw new Error(err)
  }




  // res.render("donations");
})


// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(goal)
})

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedGoal)
})

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await goal.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getDonations,
  setGoal,
  updateGoal,
  deleteGoal,
}
