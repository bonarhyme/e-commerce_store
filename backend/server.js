const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const connectDB = require("./config/db")
const productRoutes = require("./routes/productRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")

require("dotenv/config")

connectDB()

const app = express()

// Morgan is used to watch the state of the app in development mode
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}
app.use(express.json())

//Products route
app.use("/api/products", productRoutes)

//User routes
app.use("/api/users", userRoutes )

//Order routes
app.use("/api/orders", orderRoutes)

//Paypal get client ID
app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

//Upload route
app.use("/api/upload", uploadRoutes)

//Turn a file to a static file
//For ES6 module const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")))

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "/../frontend", "build", "index.html"))
    })


} else {
    app.get("/", (req, res) => {
        res.send("API is running...")
    })
}

//Not found middleware
app.use(notFound)

//The middleware for the above
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) })