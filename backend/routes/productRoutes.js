const express = require("express")
const router = express.Router()
const {getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts} = require("../controllers/productControllers")
const protect = require("../middleware/authMiddleware")
const admin  = require("../middleware/adminAuthMiddleware")


router.get("/", getProducts)
router.get("/top", getTopProducts)
router.get("/:id", getProductById)
router.get("/top", getTopProducts)
router.delete("/:id", protect, admin, deleteProduct)
router.post("/", protect, admin, createProduct)
router.put("/:id", protect, admin, updateProduct)
router.post("/:id/reviews", protect, createProductReview)



module.exports = router