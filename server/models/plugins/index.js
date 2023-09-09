const mongoose = require("mongoose")

/* Replaces the _id key with id */
const toJSONPlugin = (schema) => {
  const toJSON = schema.methods.toJSON || mongoose.Document.prototype.toJSON
  schema.set("toJSON", {
    virtuals: true,
  })

  schema.methods.toJSON = function () {
    const json = toJSON.apply(this)
    delete json._id
    delete json.__t
    delete json.__v
    return json
  }
}

const toObjectPlugin = {
  transform: (doc, ret) => {
    // remove the _id and __v of every document before returning the result
    ret.id = doc.id.toString()
    delete ret._id
    delete ret.__v
  },
}

module.exports = { toJSONPlugin, toObjectPlugin }
