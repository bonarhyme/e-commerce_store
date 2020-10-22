const User = require("../models/userModel")
const generateToken = require("../utility/generateToken")
const asyncHandler = require("express-async-handler")


//description: This registers a user
//the routes are POST request of /api/users/register
//this a public routes
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    //This helps to complete the password match
    const userExists = await User.findOne({ email })

    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }
    const user = await User.create({
        name,
        email,
        password
   })

    if (user) {
        res.status(201).json({
         _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
       })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
   }
})
//description: This authenticates the user and gets a token
//the routes are POST request of /api/users/login
//this a public routes
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    //This helps to complete the password match
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
})


//description: This gets users profile
//the routes are GETrequest of /api/users/profile
//this a private and protected route
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

//description: This updates users profile
//the routes are PUT request of /api/users/profile
//this a private and protected route
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})


module.exports = { authUser, getUserProfile, registerUser, updateUserProfile }