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
invCont.nullToString = async function (req, res, next) {
  try {
    let value = null
    let result = value.toString()
    res.send(result)
  } catch (err) {
    next(err) 
  }
}


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

module.exports = invCont