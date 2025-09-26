// Need Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a single view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleBoxByInventoryId));

//management routes

router.get("/management", utilities.handleErrors(invController.management));
router.get("/add-classification", utilities.handleErrors(invController.addClass));

router.post(
  "/add-classification",
  utilities.handleErrors(invController.registerClassification)); // actual registration



module.exports = router;



