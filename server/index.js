const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config({ path: "./.env" })
const mongoose = require("mongoose")

const app = express()
const PORT = 5000 || process.env.APP_PORT
const URL = process.env.APP_URL

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Database Connected..."))

const UserRoute = require("./routes/UserRoutes")

app.use(cors())
app.use(express.json())
app.use(UserRoute)

app.listen(PORT, () => console.log(`Server up & running on port ${PORT}`))
