// express imports

const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");


// internal imports
const Donation = require("../../models/Donation");

// add user
const donationValidators = [
    check("member_id")
        .isLength({ min: 1 })
        .trim(),
    check("payment")
        .isLength({ min: 1 })
        .withMessage("Payment Amount is required")
        .trim(),
    check("paymenttype")
        .isLength({ min: 1 })
        .withMessage("Payment Type is required")
        .trim(),


]


const donatinValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {

        // response the errors
        res.status(500).json({
            errors: mappedErrors
        });
    }
}




module.exports = {
    donationValidators,
    donatinValidationHandler
}
