const User = require("../models/Users")
const { compare } = require("bcrypt")
const { createHmac, randomUUID } = require("node:crypto")

const Login = async (req, res) => {
  const { email, password } = req.body
  try {
    const response = await User.findOne({ email })
    if (!response) return res.status(404).json({ msg: "Email not found...!" })
    const match = await compare(password, response.password)
    if (match !== true)
      return res.status(400).json({ msg: "Wrong password...!" })

    const name = response.name
    const e_mail = response.email
    const data = randomUUID()

    const hash = (value) => {
      const algorithm = "sha512"
      const secretKey = process.env.ACCESS_SECRET_TOKEN
      return createHmac(algorithm, secretKey)
        .update(value)
        .digest("hex")
        .substring(0, 32)
    }
    const accessToken = hash(data, name, e_mail)

    await User.updateOne({ email }, { $set: { apiKey: accessToken } })

    res.cookie("refreshToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({ accessToken })
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
