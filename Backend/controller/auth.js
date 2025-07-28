const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 24 * 3,
  });
};

async function handleRegister(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists with this email or username." });
    }

    // Create the user
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });

    const { password: userPassword, ...info } = user._doc;

    return res.status(201).json({ ...info, token: token });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email });

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = createToken(user._id);
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 3,
        });
        const { password, ...info } = user._doc;
        res.status(200).json({ ...info, token: token });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function handleLogout(req, res) {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "Logout Successfully" });
}

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
};
