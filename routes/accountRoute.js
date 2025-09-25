const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')

// GET login page
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// GET registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// POST registration with validation
router.post(
  "/register",
  regValidate.registrationRules(), // validation rules
  regValidate.checkRegData,        // middleware to handle errors
  utilities.handleErrors(accountController.registerAccount) // actual registration
)

module.exports = router
