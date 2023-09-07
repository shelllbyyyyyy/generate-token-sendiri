const mongoose = require("mongoose")

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
  },
  {
    timestamp: true,
  }
)

module.exports = mongoose.model("User", userSchema)
