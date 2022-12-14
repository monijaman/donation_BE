// external imports
const express = require("express");
const { check } = require("express-validator");

// internal imports
const {
  getUsersWithPayment,
  getUsers,
  addUser,
  removeUser,
  searchUser
} = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidators");

const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

const router = express.Router();

// users page
router.get(
  "/",
  decorateHtmlResponse("Users Page"),
  checkLogin,
  requireRole(["admin"]),
  getUsersWithPayment,
  // getUsers
);


// add user
router.post(
  "/",
  checkLogin,
  requireRole(["admin"]),
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);
// search user for conversation

router.get("/search/:userid", checkLogin, searchUser);
// remove user
router.delete("/:id", checkLogin, requireRole(["admin"]), removeUser);

module.exports = router;