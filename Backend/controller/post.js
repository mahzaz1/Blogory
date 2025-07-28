const Post = require("../models/post");
const fs = require("fs");
const path = require("path");

async function handleCreatePost(req, res) {
  const { title, desc, image, username, userId, categories } = req.body;

  console.log("data", title, desc, image, username, userId, categories);

  try {
    const createdPost = await Post.create({
      title,
      desc,
      image,
      username,
      userId,
      categories,
    });

    return res.status(201).json({
      message: "Post created successfully.",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        desc: createdPost.desc,
        image: createdPost.image,
        username: createdPost.username,
        userId: createdPost.userId,
        categories: createdPost.categories,
        createdAt: createdPost.createdAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message, // This will contain specific validation error messages
      });
    }

    console.error("Error creating post:", error);
    return res.status(500).json({
      error: "Failed to create the post. Please try again later.",
    });
  }
}

async function handleGetAllPosts(req, res) {
  try {
    const searchQuery = req.query.search || "";

    const searchFilter = {
      title: { $regex: searchQuery, $options: "i" },
    };

    const posts = await Post.find(searchFilter);

    res.status(200).json({ count: posts.length, posts });
  } catch (error) {
    console.error("Error Getting All Posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleUpdatePost(req, res) {
  const { id } = req.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(400).json({ error: "No post found" });
    } else {
      return res.status(200).json({ updatedPost });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function handleGetPostById(req, res) {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ error: "No post found" });
    } else {
      return res.status(200).json({ post });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function handleGetPostByUserId(req, res) {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const posts = await Post.find({ userId: id }); // Make sure the key matches schema (userID, not userId)

    return res.status(200).json({
      message: `Found ${posts.length} post(s) for user.`,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function handleDeletePost(req, res) {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ error: "No post found" });
    }

    // Get the image filename
    const imagePath = path.join(__dirname, "..", "images", post.image);

    // Delete the post
    await Post.findByIdAndDelete(id);

    // Delete the image file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
      }
    });

    return res
      .status(200)
      .json({ message: "Post and image deleted successfully" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  handleGetAllPosts,
  handleDeletePost,
  handleGetPostById,
  handleUpdatePost,
  handleCreatePost,
  handleGetPostByUserId,
};
