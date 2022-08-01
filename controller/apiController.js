// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");


// do login
async function apilogin(req, res, next) {


    try {
        // find a user who has this email/username
        const user = await User.findOne({
            $or: [{ email: req.body.username }, { serial: req.body.username }],
        });

        if (user && user._id) {
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (isValidPassword) {
                // prepare the user object to generate token
                const userObject = {
                    userid: user._id,
                    username: user.name,
                    email: user.email,
                    avatar: user.avatar || null,
                    role: user.role || "user",
                };

                // generate token
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY,
                });

                // set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true,
                });

                // set logged in user local identifier
                res.locals.loggedInUser = userObject;

                res.status(200).json({
                    message: 'Login Successfully.',
                    token: token,
                    data: userObject
                });

            } else {
                throw createError("Login failed! Please try again 1.");
            }
        } else {
            throw createError("Login failed! Please try again 2.");
        }
    } catch (err) {
        res.status(200).json({
            message: err.message,
        });
    }


}


// do logout
async function getDonations(req, res, next) {

    try {

        res.status(400).json({
            errorMessage: req,
            status: false
        });

        var query = {};
        query["$and"] = [];
        query["$and"].push({
            //  is_delete: false,
            member_id: req.user.id
        });


        if (req.query && req.query.search) {
            query["$and"].push({
                name: { $regex: req.query.search }
            });
        }
        var perPage = 5;
        var page = req.query.page || 1;


        User.find(query, { payment: 1, paymenttype: 1, paymentdone: 1, comments: 1, createdAt: 1 })
            .skip((perPage * page) - perPage).limit(perPage)
            .then((data) => {
                product.find(query).count()
                    .then((count) => {

                        if (data && data.length > 0) {
                            res.status(200).json({
                                status: true,
                                title: 'Donation retrived.',
                                products: data,
                                current_page: page,
                                total: count,
                                pages: Math.ceil(count / perPage),
                            });
                        } else {
                            res.status(400).json({
                                errorMessage: 'There is no product!',
                                status: false
                            });
                        }

                    });

            }).catch(err => {
                res.status(400).json({
                    errorMessage: err.message || err,
                    status: false
                });
            });
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }


}


module.exports = {
    apilogin,
    getDonations
};