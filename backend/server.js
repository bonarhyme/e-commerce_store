const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const productRoutes = require("./routes/productRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const userRoutes = require("./routes/userRoutes")

require("dotenv/config")

connectDB()

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Api is running...")
})
//Products route
app.use("/api/products", productRoutes)

//User routes
app.use("/api/users", userRoutes )

//Not found middleware
app.use(notFound)

//The middleware for the above
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) })