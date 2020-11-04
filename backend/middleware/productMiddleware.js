const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel.js')

const reduceCountInStock = asyncHandler(async (req, res, next) => {
  const { orderItems } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product)
      if (product) {
        product.countInStock = product.countInStock - item.qty
      }
      await product.save()
    })
    next()
  }
})

module.exports =  reduceCountInStock