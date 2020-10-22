const express = require("express")
const router = express.Router()
const { authUser, getUserProfile, registerUser, updateUserProfile } = require("../controllers/userControllers")
const  protect  = require("../middleware/authMiddleware")

router.post("/register", registerUser)
router.post("/login", authUser )
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile )


module.exports = router