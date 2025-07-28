const { Router } = require("express");
const {
  handleRegister,
  handleLogin,
  handleLogout,
} = require("../controller/auth");
const { verifyTokenApi, verifyToken } = require("../middleware/verifytoken");

const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", verifyToken, handleLogout);
router.post("/verify-token", verifyTokenApi);

module.exports = router;
