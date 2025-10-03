// Need Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const invValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build a single view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleBoxByInventoryId));

//management routes

router.get("/management", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.management));
router.get("/add-classification", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.addClass));
router.get("/add-inventory", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.newInventory))


router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(), // validation rules
  invValidate.checkClass, // middleware to handle errors
  utilities.handleErrors(invController.registerClassification)); // actual registration


router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  invValidate.addItemRules(), // validation rules
  invValidate.checkItem, // middleware to handle errors
  utilities.handleErrors(invController.addInventory)); // actual registration
  

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventoryId", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.editInventoryItem));
router.post("/update", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.updateInventory))


router.get("/delete/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteView))

router.post("/delete", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteItem))



module.exports = router;



