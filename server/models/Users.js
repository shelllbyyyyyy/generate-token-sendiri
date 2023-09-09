const mongoose = require("mongoose")
const { toJSONPlugin, toObjectPlugin } = require("./plugins")

const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
    },
    email: {
      type: String,
      default: "",
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    usage: {
      date: { type: Date, default: new Date().toISOString() },
      count: { type: Number, default: 0 },
    },
    apiKey: {
      type: String,
      default: "",
      index: true,
    },
  },
  {
    timestamp: true,
    toObject: toObjectPlugin,
  }
)

toJSONPlugin(userSchema)

module.exports = mongoose.model("User", userSchema)
