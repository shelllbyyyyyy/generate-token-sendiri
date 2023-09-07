const express = require("express")
const {
  getUsers,
  createUser,
  updateUsers,
  deleteUsers,
} = require("../controllers/UserController")

const r = express.Router()

r.get("/user", getUsers)
r.post("/user", createUser)
r.put("/user/:id", updateUsers)
r.delete("/user/:id", deleteUsers)

module.exports = r
