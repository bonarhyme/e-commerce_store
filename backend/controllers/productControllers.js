const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")

//description: This fetches all the products
//the routes are GET request of /api/products
//this a public routes
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})

//description: This fetches single product
//the routes are get request
//this a public routes
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error("Product not found")
    }
})

module.exports = {getProducts, getProductById}