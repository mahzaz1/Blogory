const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

async function handleUpdateUser(req, res) {
  const { username } = req.body;
  const { id } = req.params;

  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ userId: updatedUser._id });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function handleDeleteUser(req, res) {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    await Post.deleteMany({ userId: id });

    await Comment.deleteMany({ userId: id });


    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

async function handleGetUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // Exclude 'password'

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  handleUpdateUser,
  handleDeleteUser,
  handleGetUser,
};
