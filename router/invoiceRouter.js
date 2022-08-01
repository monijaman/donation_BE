// external imports
const express = require("express");
const { check } = require("express-validator");
// internal imports
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");
const { donationValidators, donatinValidationHandler } = require("../middlewares/invoice/invoiceValidator");
const router = express.Router();


const {
  searchUser,
  invoice,
  addDonnation,
  removeDonation
} = require("../controller/invoiceController");




// add user
router.post(
  "/adddonation",
  checkLogin,
  requireRole(["admin"]),
  avatarUpload,
  donationValidators,
  donatinValidationHandler,
  addDonnation
);

router.get(
  "/",
  decorateHtmlResponse("Donation"),
  checkLogin,
  requireRole(["admin"]),
  invoice
);

router.delete("/:id", checkLogin, requireRole(["admin"]), removeDonation);


router.get("/invoice/:id", decorateHtmlResponse("Donation"), checkLogin, invoice);


module.exports = router;