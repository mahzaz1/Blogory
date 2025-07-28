const { Router } = require("express");
const {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetAllPostComment,
} = require("../controller/comment");

const router = Router();

router.post("/create", handleCreateComment);
router.get("/post/:id", handleGetAllPostComment);
router.put("/:id", handleUpdateComment);
router.delete("/:id", handleDeleteComment);

module.exports = router;