const { Router } = require("express");
const {
  handleUpdateUser,
  handleDeleteUser,
  handleGetUser,
} = require("../controller/user");

const router = Router();

router.get("/:id", handleGetUser);
router.put("/:id", handleUpdateUser);
router.delete("/:id", handleDeleteUser);

module.exports = router;
