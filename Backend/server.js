require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

app.use("/api/github", require("./routes/github"))
app.use("/api/deployments", require("./routes/deployments"))
app.use("/api/auth", require("./routes/auth"))

app.listen(3005, () => {
  console.log("Backend running on http://localhost:3005")
})
