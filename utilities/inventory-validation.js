
const { body, validationResult } = require("express-validator")
const validation = {}



validation.classificationRules = () => {
    return [
      
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please provide a name"), // on error this message is sent.    
    ]
}


validation.addItemRules = () => {
    return [
      
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide this field"), // on error this message is sent.

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide this field"), // on error this message is sent.

        body("inv_year")
            .matches(/^[0-9]+$/)
            .notEmpty()
            .isLength({ min: 4 })
            .withMessage("Please provide this field"), // on error this message is sent.

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide this field"), // on error this message is sent.

        body("inv_price")
            .matches(/^[0-9]+$/)
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide this field"), // on error this message is sent.

        body("inv_miles")
            .matches(/^[0-9]+$/)
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide this field"), // on error this message is sent.

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide this field"), // on error this message is sent.
    ]
}

validation.checkClass = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/add-classification", {
        errors,
        title: "Add-classification",
        nav,
        classification_name
        })
        return
    }
    next()
    }

validation.checkItem = async (req, res, next) => {
    const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color, } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/add-inventory", {
        errors,
        title: "Add-Inventory",
        nav,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        })
        return
    }
    next()
    }


module.exports = validation
    