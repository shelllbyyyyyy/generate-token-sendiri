const User = require("../models/Users")
const { compare } = require("bcrypt")
const { createHmac } = require("node:crypto")

const Login = async (req, res) => {
  const { email, password } = req.body
  try {
    const response = await User.findOne({ email })
    if (!response) return res.status(404).json({ msg: "Email not found...!" })
    const match = await compare(password, response.password)
    if (match !== true)
      return res.status(400).json({ msg: "Wrong password...!" })

    const data = (response.name, response.email)
    const generateRandomKey = data
    const hash = (value) => {
      const algorithm = "sha512"
      const secretKey = process.env.ACCESS_SECRET_TOKEN
      return createHmac(algorithm, secretKey)
        .update(value)
        .digest("hex")
        .substring(0, 32)
    }

    const token = generateRandomKey
    const hashedToken = hash(token)

    await User.updateOne({ email }, { $set: { apiKey: hashedToken } })

    res.cookie("refreshToken", hashedToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({ hashedToken })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) return res.status(204).json({ msg: "No token...!" })

    const response = await User.findOne({ apiKey: refreshToken })
    if (!response) return res.status(404).json({ msg: "User not found...!" })

    const userId = response._id
    await User.updateOne({ _id: userId }, { $set: { apiKey: "" } })

    res.clearCookie("refreshToken")
    return res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

module.exports = { Login, Logout }
