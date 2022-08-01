// external imports
const express = require("express");

// internal imports
const { getLogin, logout } = require("../controller/loginController");
const { apilogin, getDonations } = require("../controller/apiController");
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

const {
    doLoginValidators,
    doLoginValidationHandler,
} = require("../middlewares/login/loginValidators");
const { redirectLoggedIn } = require("../middlewares/common/checkLogin");

const router = express.Router();

// set page title
const page_title = "Login";

// login page
//router.get("/", decorateHtmlResponse(page_title), redirectLoggedIn, getLogin);

// process login
router.post(
    "/login",
    //checkLogin,
    apilogin
);

router.get("/getdonations/", getDonations);
// router.get("/getdonations/:page");


// logout
router.delete("/", logout);

module.exports = router;
