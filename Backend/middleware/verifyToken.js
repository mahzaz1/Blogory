const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ error: "You are not authenticated" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, data) => {
    if (error) {
      return res
        .clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(400)
        .json({ error: "Token is not valid" });
    }

    // req.userId = data.id; // optional: attach user info
    next(); // Only call next if no response has been sent
  });
}

async function verifyTokenApi(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ error: "You are not authenticated" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, data) => {
    if (error) {
      return res
        .clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(400)
        .json({ error: "Token is not valid" });
    }

    // If you're only verifying, do NOT call next()
    return res.status(200).json({ message: "Token is valid" });
  });
}

module.exports = { verifyToken, verifyTokenApi };
