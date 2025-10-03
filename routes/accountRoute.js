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

// process the login attempt
router.post(
  "/login", regValidate.loginRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/management", utilities.checkLogin, utilities.handleErrors(accountController.deliverLogin))



router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

router.post(
  "/update-account",
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  utilities.handleErrors(accountController.updatePassword)
)



router.get("/logout", async (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session during logout:", err);
    }
    
    res.clearCookie("jwt");
    
    res.redirect("/");
  });
});


module.exports = router
