const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."], // Custom error message
    },
    desc: {
      type: String,
      required: [true, "Description is required."], // Custom error message
    },
    image: {
      type: String,
      required: [true, "Image is required."], // Custom error message
    },

    username: {
      type: String,
      required: [true, "Username is required."], // Custom error message
    },
    userId: {
      type: String,
      required: [true, "User ID is required."], // Custom error message
    },
    categories: {
      type: [String], // Array of strings (categories)
      validate: {
        validator: function (v) {
          // Validate that categories are strings
          return v.every((category) => typeof category === "string");
        },
        message: "Each category should be a string.",
      },
    },
  },
  { timestamps: true }
);

// If you want to ensure the userID is unique across posts, add the following line
// postSchema.index({ userID: 1 }, { unique: true });

const Post = mongoose.model("post", postSchema);

module.exports = Post;
