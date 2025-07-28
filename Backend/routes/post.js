const { Router } = require("express");
const {
  handleCreatePost,
  handleGetAllPosts,
  handleDeletePost,
  handleGetPostById,
  handleUpdatePost,
  handleGetPostByUserId,
} = require("../controller/post");
const { verifyToken } = require("../middleware/verifytoken");

const router = Router();

router.get("/", verifyToken, handleGetAllPosts);
router.get("/user/:id", handleGetPostByUserId);
router.post("/create", handleCreatePost);
router.get("/:id", handleGetPostById);
router.put("/:id", handleUpdatePost);
router.delete("/:id", handleDeletePost);

module.exports = router;
