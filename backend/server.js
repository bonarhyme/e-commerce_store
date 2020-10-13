const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const productRoutes = require("./routes/productRoutes")
const {notFound, errorHandler} = require("./middleware/errorMiddleware")

require("dotenv/config")

connectDB()

const app = express()

app.get("/", (req, res) => {
    res.send("Api is running...")
})
app.use("/api/products", productRoutes)

//Not found middleware
app.use(notFound)

//The middleware for the above
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) })