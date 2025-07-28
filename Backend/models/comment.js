const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
      // unique: true,
    },
  },
  { timestamps: true }
);

// commentSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment ;
