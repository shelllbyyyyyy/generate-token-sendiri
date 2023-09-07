const User = require("../models/Users")
const bcrypt = require("bcrypt")

const getUsers = async (req, res) => {
  try {
    const response = await User.find()
    res.json(response)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const createUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body
  const hashPassword = await bcrypt.hash(password, 10)

  try {
    if (confPassword !== password)
      res.status(400).json({ msg: "Password mismatched...!" })
    const user = new User({
      name,
      email,
      password: hashPassword,
      confPassword,
    })

    await user.save()

    res.status(200).json({
      data: user,
      msg: "User created successfully...!",
    })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const updateUsers = async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.findOne({ _id: req.params.id })
  const compare = await bcrypt.compare(password, user.password)

  try {
    if (!compare)
      return res.status(400).json({ msg: "sorry wrong password...!" })

    const user = await User.updateOne(
      { _id: req.params.id },
      { $set: { name, email } }
    )
    res.status(200).json({
      user,
      msg: "Data updated successfully...!",
    })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

const deleteUsers = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id })
    res.status(200).json({
      msg: "User deleted...!",
    })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

module.exports = { createUser, getUsers, updateUsers, deleteUsers }
