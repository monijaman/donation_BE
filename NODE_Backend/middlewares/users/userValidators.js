// express imports

const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const User = require("../../models/People");

// add user
const addUserValidators = [
    check("engname")
        .isLength({ min: 1 })
        .withMessage(" Name must not contain anythin other than alphabet")
        .trim(),
    check("name")
        .isLength({ min: 1 })
        .withMessage("Name in Bangla is required")
        .withMessage(" Name must not contain anythin other than alphabet")
        .trim(),
    check("password")
        .isLength({ min: 5 })
        //  .isStrongPassword()
        .withMessage("Password must be at least 5 characters long"),

    check("fathersname")
        .isLength({ min: 5 })
        .withMessage("Fathers Name is required")
        .trim(),

    check("mothersname")
        .isLength({ min: 5 })
        .withMessage("Fathers Name is required")
        .trim(),

    check("dateofbirth")
        .isLength({ min: 5 })
        .withMessage("Fathers Name is required")
        .trim(),

    check("occupation")
        .isLength({ min: 4 })
        .withMessage("Occupationis required")
        .trim(),

    check("education")
        .isLength({ min: 2 })
        .withMessage("Education is required")
        .trim(),

    check("nid")
        .isLength({ min: 2 })
        .withMessage("NID  is required")
        .trim(),

    check("currentaddress")
        .isLength({ min: 5 })
        .withMessage("Current address  is required")
        .trim(),

    check("permaaddress")
        .isLength({ min: 5 })
        .withMessage("Permanent address is required")
        .trim(),

    check("serial")
        .isLength({ min: 3 })
        .withMessage("Serial number required")
        .trim(),

    check("status")
        .isLength({ min: 3 })
        .withMessage("Current status is required")
        .trim()


]

const addUserValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // remove uploaded files
        if (req.files.length > 0) {
            const { filename } = req.files[0];
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${filename}`),
                (err) => {
                    if (err) console.log(err)
                }
            )
        }

        // response the errors
        res.status(500).json({
            errors: mappedErrors
        });
    }
}

module.exports = {
    addUserValidators,
    addUserValidationHandler
}
