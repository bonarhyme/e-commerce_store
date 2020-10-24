const express = require("express")
const router = express.Router()
const  addOrderItems = require("../controllers/orderController")
const  protect  = require("../middleware/authMiddleware")
const getOrderById = require("../controllers/orderController")

router.post("/", protect, addOrderItems)
router.get("/:id", protect, getOrderById)


module.exports = router