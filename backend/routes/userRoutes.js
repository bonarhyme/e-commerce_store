const express = require("express")
const router = express.Router()
const { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser } = require("../controllers/userControllers")
const protect = require("../middleware/authMiddleware")
const admin  = require("../middleware/adminAuthMiddleware")

router.get("/", protect, admin, getUsers)
router.post("/register", registerUser)
router.post("/login", authUser )
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)
router.delete("/:id", protect, admin, deleteUser)
router.get("/:id", protect, admin, getUserById)
router.put("/:id", protect, admin, updateUser)


module.exports = router