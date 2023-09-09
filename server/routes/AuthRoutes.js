const express = require("express")
const { Login, Logout } = require("../controllers/AuthControler")

const r = express.Router()

r.post("/login", Login)
r.delete("/logout", Logout)

module.exports = r
