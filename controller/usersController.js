// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const User = require("../models/People");
const Donation = require("../models/Donation");
const { pipeline } = require("stream");
// get users page
async function getUsersWithPayment(req, res, next) {

  try {
    // const users = await User.find();
    // res.render("users", {
    //   users: users,
    // });
    // const users = new User();


    const data = User.aggregate([{
      $lookup: {
        from: "donations", // collection name in db
        localField: "_id",
        foreignField: "member_id",
        as: "dataset"
      }
    },
    // {
    //   $unwind: {
    //     path: "$dataset",
    //     preserveNullAndEmptyArrays: true
    //   },

    // },
    {
      $sort: {
        'dataset.createdAt': -1
      }
    }, { "$limit": 100 }
      // {
      //   $group: {
      //     _id: null,
      //     dataset: {
      //       $push: "$dataset.member_id"
      //     }
      //   }
      // }
    ]).exec(function (err, results) {

      // results.forEach(element => {
      //   console.log(element.dataset)
      // });
      console.log(results)
      res.render("users", {
        users: results,
      });
    })

    let dataset = []
    //  const aggregate = User.aggregate([{ $match: { serial: { $gte: 70 } } }]);
    let pipeline = [{
      //  { $match: { "role": "admin" } },
      $project: {
        "username": "$serial", engname: 1,
      }
      // { $limit: 2 }, { $skip: 1 }
    }]

    // let dataset;
    const aggregate = User.aggregate(pipeline).exec(function (err, results) {
      // console.log(results);
      //  dataset.push(results)
    });

    /*   let restPeyment;
       const member_id = "62976da51c54ff219f956e49";
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
       ]);*/

    // console.log(countDonation)
    // User.find();
    //   console.log(aggregate)


    // const data = User.aggregate([{
    //   $lookup: {
    //     from: "donations", // collection name in db
    //     localField: "peoples._id",
    //     foreignField: "member_id",
    //     as: "dataset"
    //   }
    // }]).exec(function (err, results) {
    //   console.log(results);
    // });

    // console.log(results)
  } catch (err) {
    next(err);
  }


}

// get users page
async function getUsers(req, res, next) {

  try {
    const users = await User.find();
    res.render("users", {
      users: users,
    });
  } catch (err) {
    next(err);
  }


}

// add user
async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // save user or send error
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not add the user!",
        },
      },
    });
  }
}

// remove user
async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    // remove user avatar if any
    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "User was removed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}


// get user of a conversation
async function searchUser(req, res, next) {

  try {

    const user = await User.findOne({
      _id: req.params.userid,
    });

    res.status(200).json({
      data: {
        user: user
      },
      user: req.user.userid
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}


// search user
async function searchUsers(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");
  const serial_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");
  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
            {
              serial: serial_search_regex,
            },
          ],
        },
        "name avatar"
      );

      res.json(users);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

module.exports = {
  getUsersWithPayment,
  getUsers,
  addUser,
  removeUser,
  searchUser
};
