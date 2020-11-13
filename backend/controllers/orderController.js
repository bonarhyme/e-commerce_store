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
    const order = new Order({
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





// @desc    get order by Id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {

  //populate is used to fetch  a certaain collection associated to a particular userId or OnjectId in the database. otice the space in the data you try to populate

  const order = await Order.findById(req.params.id).populate("user", "name email")

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error("Order Not found")
  }
})



// @desc    update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id)

  if(order){
      order.isPaid = true,
      order.paidAt = Date.now(),
      order.paymentResult = {
        message: req.body.messge,
        reference: req.body.reference,
        status: req.body.status,
        transactionId: req.body.trans,
        user: order.user.email
      }

    const updatedOrder = await order.save()

    res.json(updatedOrder)

  } else {
    res.status(404)
    throw new Error("Order Not found")
  }
})


// @desc    Get logged in user order
// @route   GET /api/orders/myorders
// @access  Private

const getMyOrders = asyncHandler(async (req, res) => {

  const orders = await Order.find({ user: req.user._id })
  res.json(orders)

})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin

const getOrders = asyncHandler(async (req, res) => {
//This gets the orders and also gets the user name and ID associated with it
  const orders = await Order.find({}).populate("user", "id name")
  res.json(orders)

})


// @desc    update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id)

  if(order){
      order.isDelivered = true,
      order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)

  } else {
    res.status(404)
    throw new Error("Order Not found")
  }
})

module.exports = { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }