const Order = require('../models/orderModel')
const asyncHandler = require('express-async-handler')


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = await new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

     const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})


module.exports = addOrderItems


// @desc    get order by Id
// @route   POST /api/orders/;id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  //populate is used to fetch  a certaain collection associated to a particular userId or OnjectId in the database. otice the space in the data you try to populate
  const order = await (await Order.findById(req.params.id)).populate("user", "name email")

  if(order){
    res.json(order)
  } else {
    res.status(404)
    throw new error("Order Not found")
  }
})


module.exports = getOrderById
