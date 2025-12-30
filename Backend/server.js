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

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
