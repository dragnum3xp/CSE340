const { router } = require("express")
const invModel = require("../models/inventory-model")
const Util = {}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="/inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + ' on CSE Motors" /></a>'
            grid += '<div Class="namePrice">'
            grid += '<hr />'
            grid += '<hr2>'
            grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the single view HTML
* ************************************ */

Util.buildSingleBox = function(vehicle) {
    let box = '<div id="single_view">'

    if (!vehicle) {
        box += "<p>No vehicle found</p></div>"
        return box
    }

    box += '<picture>' + '<img src="' + vehicle.inv_image 
    + '" alt="Image of ' + vehicle.inv_make + ' '+ vehicle.inv_model + ' on CSE Motors"/>'
    box += '</picture>'
    box += '<section>'
    box += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    box += '<p class="info"><strong>Price: </strong>' + '<span>$'
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>' + '</p>' 
    box += '<p class="info"><strong>Description: </strong>' + vehicle.inv_description + '</p>'
    box += '<p class="info"><strong>Color: </strong>' + vehicle.inv_color + '</p>'
    box += '<p class="info"><strong>Miles: </strong>' + '<span>'
    + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span> </p>'
    
    box += '</div>'

    return box
}

    
 

/* *********************
 * Constructs the nav HTML unordered list
 ******************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
