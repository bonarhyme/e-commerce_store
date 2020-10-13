//Remember to remove this file
//Remember to remove the data:import and data:delete in the package.json
//They are opnly for testing purposes

const mongoose = require("mongoose")
require("dotenv/config")
const users = require("./data/users")
const products = require("./data/Products")
const User = require("./models/userModel")
const Order = require("./models/orderModel")
const Product = require("./models/productModel")
const connectDB = require("./config/db")
connectDB()

const importData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        })

        await Product.insertMany(sampleProducts)

        console.log("Data Imported!!!!!!!")
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}


const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log("Data Destroyed!!!!!!!")
        process.exit()
    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

if (process.argv[2] === "-d" ){
    destroyData()
} else {
    importData()
}