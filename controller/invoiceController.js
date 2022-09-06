// external imports
const createError = require("http-errors");

// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");



// internal imports
const User = require("../models/People");
const Donation = require("../models/Donation");
const Message = require("../models/Message");
const escape = require("../utilities/escape");
const path = require("path");
const { ObjectId } = require('mongodb');

async function invoice(req, res, next) {

    try {
        const user = await User.findOne({
            _id: req.query.id,
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

        const installments = await Donation.find({
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



        res.render("donations", {
            user: user,
            installments: installments,
            lastDonation: lastDonation,
            donation: countDonation,
            restAmount: restPeyment
        });
    } catch (err) {
        next(err);
    }

    // res.render("donations");
}

async function addDonnation(req, res, next) {
    let newDonation;
    let paymentmonth = req.body.paymentdone;

    let durDate = null;
    let donation = {};
    let monthCount = 0;
    let installAmount = process.env.MONTHLY_PAYMENT;


    if (req.body.paymenttype == 'Monthly') {




        if (req.body.payment % installAmount != 0) {
            let errormsg = 'You should input 200 or multipy by 200'
            res.status(500).json({
                errors: {
                    common: {
                        msg: errormsg
                    },
                },
            });
            return false;
        }

        monthCount = (req.body.payment / installAmount);

        donation = await Donation.findOne({
            member_id: req.body.member_id,
            paymenttype: 'Monthly'
        }).limit(1).sort({ $natural: -1 });



        if (donation == null) {
            durDate = new Date(paymentmonth);
            durDate.setMonth(durDate.getMonth())


        } else {
            durDate = new Date(donation.paymentdone);
            durDate.setMonth(durDate.getMonth() + monthCount)
        }

    }
    newDonation = new Donation({
        ...req.body,
        paymentdone: durDate
    });

    // save user or send error
    try {
        const result = await newDonation.save();

        res.status(200).json({
            message: "saved"
        });
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
            message: req.body,
        });
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

// search user
async function searchUser(req, res, next) {
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
                            engname: name_search_regex,
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
                "name avatar serial"
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


// remove user
async function removeDonation(req, res, next) {
    try {
        const user = await Donation.findByIdAndDelete({
            _id: req.params.id,
        });


        res.status(200).json({
            message: "Donation was removed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Could not delete the Donation!",
                },
            },
        });
    }
}

module.exports = {
    addUser,
    invoice,
    searchUser,
    addDonnation,
    removeDonation
};