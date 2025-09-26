const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  null toString error
 * ************************** */
/*invCont.nullToString = async function (req, res, next) {
  try {
    let value = null
    let result = value.toString()
    res.send(result)
  } catch (err) {
    next(err) 
  }
}
*/


/* ***************************
 *  Build inventory by single view
 * ************************** */
invCont.buildSingleBoxByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getSingleView(inventory_id)

    if (!data || (data.rows && data.rows.length === 0)) {
      return res.render("inventory/single", {
        title: "Vehicle not found",
        nav: await utilities.getNav(),
        box: "<p>Vehicle not found</p>",
      })
    }

    const vehicle = data.rows ? data.rows[0] : data
    const box = await utilities.buildSingleBox(vehicle)
    const nav = await utilities.getNav()
    const className = vehicle.inv_model
    const make = vehicle.inv_make

    res.render("inventory/single", {
      title: make + ' ' + className,
      nav,
      box,
    })
  } catch (error) {
    next(error)
  }
}

invCont.newClass = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: '',
  })
}

invCont.management = async function(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

invCont.addClass = async function(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add-classification",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Process functionality to add-classification
* *************************************** */
invCont.registerClassification = async function(req, res, next) {
  try {
    const { classification_name } = req.body
    const regResult = await invModel.registerClassification(classification_name)

    if (regResult && regResult.rowCount > 0) {
      req.flash("notice", `Congratulations, you registered a ${classification_name} classification.`)
      return res.redirect(303, "/inv/add-classification")
    } else {
      const nav = await utilities.getNav()
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(500).render("inventory/add-classification", {
        title: "Registration Failed",
        nav,
        errors: "Registration failed",
        classification_name
      })
    }
  } catch (error) {
    return next(error)
  }
}


invCont.newInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const classification_list =await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add-inventory",
    nav,
    errors: null,
    classification_list,
    inv_make: '',
    inv_model: '',
    inv_year: '',
    inv_description: '',
    inv_image: '/images/vehicles/no-image',
    inv_thumbnail: '/images/vehicles/no-image-tn',
    inv_price: '',
    inv_miles: '',
    inv_color: '',
  })
}

/* ****************************************
*  Process functionality to add-inventory
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  try{  
    
    const { inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id } = req.body

    const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image,
        inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

    if (regResult) {
      req.flash("notice", `Congratulations, you're added ${inv_make} ${inv_model}.`)
      return res.redirect(303, "/inv/management")
    } else {
      let nav = await utilities.getNav()
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("/add-inventory", {
        title: "Add-Inventory",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    return next(error)
  }
}


module.exports = invCont