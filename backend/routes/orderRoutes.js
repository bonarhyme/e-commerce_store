const express = require("express")
const router = express.Router()
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered } = require("../controllers/orderController")
const protect = require("../middleware/authMiddleware")
const  admin  = require("../middleware/adminAuthMiddleware")
const  reduceCountInStock = require('../middleware/productMiddleware.js')

router.post("/", protect, reduceCountInStock, addOrderItems)
router.get("/", protect, admin, getOrders)
router.get("/myorders", protect, getMyOrders)
router.get("/:id", protect, getOrderById)
router.put("/:id/pay", protect, updateOrderToPaid)
router.put("/:id/deliver", protect, admin, updateOrderToDelivered)

module.exports = router