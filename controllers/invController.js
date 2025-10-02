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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
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
  const classification_list = await utilities.buildClassificationList()
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


invCont.editInventoryItem = async function (req, res, next) {
    const inv_id = parseInt(req.params.inventoryId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getSingleView(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year ,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/*  ********************
 *  Build delete confirmation view
 *  ******************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getSingleView(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
  
}

/*  ********************
 *  Delete Inventory Item
 *  ******************** */

invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if(deleteResult) {
    req.flash("notice", 'The deletion was successful.')
    res.redirect('/inv/management')
  } else {
    req.flash("notice", 'Sorry, the delete failed')
    res.redirect("/inv/delete/inv_id")
  }
  
}

module.exports = invCont