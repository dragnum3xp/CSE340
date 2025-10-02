const pool = require("../database/")

 /* *************
  *  Get all classification data
  ************ */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
} 

/* ***************************
 *  Get a single item based on the inventory id
 * ************************** */
async function getSingleView(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * from public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0] || null
  } catch (error) {
    console.error("Database error in getSingleView:", error)
    throw error
  }
}

async function registerClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function addInventory(inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id){
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, 
      [inv_make, inv_model, inv_year ? parseInt(inv_year) : null, inv_description, inv_image,
      inv_thumbnail, inv_price ? parseInt(inv_price) : null, inv_miles ? parseInt(inv_miles) : null, inv_color, classification_id ? parseInt(classification_id) : null])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(inv_id,
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price ? parseInt(inv_price) : null,
      inv_year ? parseInt(inv_year) : null,
      inv_miles ? parseInt(inv_miles) : null,
      inv_color,
      classification_id ? parseInt(classification_id) : null,
      inv_id ? parseInt(inv_id) : null
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */

async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id =$1"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    new Error("Error in deleting Inventory")
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getSingleView, registerClassification, addInventory, updateInventory, deleteInventoryItem};