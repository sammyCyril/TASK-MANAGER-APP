const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({ status: "error", msg: "Email and password are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send({ status: "ok", msg: "User created" });
  } catch (err) {
    res.status(400).send({ status: "error", msg: "Email already in use" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({ status: "error", msg: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ status: "error", msg: "Password is incorrect" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ status: "ok", token });
  } catch (e) {
    res.status(500).send({ status: "error", msg: "Server error" });
  }
};

module.exports = {
  register,
  login
};

