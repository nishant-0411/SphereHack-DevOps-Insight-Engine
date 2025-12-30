require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3005;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
