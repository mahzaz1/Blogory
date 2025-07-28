const Comment = require("../models/comment");

async function handleCreateComment(req, res) {
  const { comment, author, postId, userId } = req.body;

  if (!comment || !author || !postId || !userId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await Comment.create({
      comment,
      author,
      postId,
      userId,
    });

    return res.status(200).json({
      message: "Comment created successfully.",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function handleUpdateComment(req, res) {
  const { id } = req.params;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { comment: req.body.comment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(400).json({ error: "No comment found" });
    } else {
      return res.status(200).json({ updatedComment });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function handleDeleteComment(req, res) {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(400).json({ error: "No comment found" });
    } else {
      return res
        .status(200)
        .json({ message: "Comment has been deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAllPostComment(req, res) {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "Post Id is required." });
    }

    const allComments = await Comment.find({ postId: id });
    return res.status(200).json({
      message: `Found ${allComments.length} post(s) for user.`,
      allComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetAllPostComment,
};
