const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")

//description: This fetches all the products
//the routes are GET request of /api/products
//this a public routes
const getProducts = asyncHandler(async (req, res) => {
    //use page size to display the number of item on a page...or pagination
    const pageSize = 2
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: "i"
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//description: This fetches single product
//the routes are get request /api/products/:id
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

//description: This deletes a single product
//the routes are get request
//this a private/admin routes
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        //This is hypothessed code for the admin that created the product to be able to delete it
        //  if(req.user._id === product.user._id){
        // await product.remove()
        // }

        //Normal code
        await product.remove()
        res.json({ message: "Product removed"})

    } else {
        res.status(404)
        throw new Error("Product not found")
    }
})

//description: This ceates a single product
//the routes are POST request /api/products
//this a private/admin routes
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample brand",
        category: "Sample category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description"
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

//description: This updates a product
//the routes are PUT request /api/products/:id
//this a private/admin routes
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.status(201).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error("Product not found")
    }
})


//description: This creates a new review
//the routes are POST request /api/products/:id/reviews
//this a private routes
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if (alreadyReviewed) {
            res.status(400)
            throw new Error("Product already reviewed")
        }
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id
            }

            product.reviews.push(review)

            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

            await product.save()
            res.status(201).json({ message: "Review added"})

    } else {
        res.status(404)
        throw new Error("Product not found")
    }
})

module.exports = {getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview}