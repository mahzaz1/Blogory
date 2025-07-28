import React, { useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { API_URL } from '../url';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Comments({ postId, user }) {
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const queryClient = useQueryClient();

  const fetchComments = async ({ queryKey }) => {
    const [, postId] = queryKey;
    const response = await axios.get(`${API_URL}/comment/post/${postId}`, {
      withCredentials: true,
    });
    return response.data.allComments;
  };

  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: fetchComments,
  });

  const addComment = useMutation({
    mutationFn: (newCommentData) =>
      axios.post(`${API_URL}/comment/create`, newCommentData, {
        withCredentials: true,
      }),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries(['comments', postId]);
    },
    onError: (err) => {
      console.error('Error adding comment:', err);
      alert('Failed to add comment.');
    }
  });

  const updateComment = useMutation({
    mutationFn: ({ id, comment }) =>
      axios.put(`${API_URL}/comment/${id}`, { comment }, { withCredentials: true }),
    onSuccess: () => {
      setEditCommentId(null);
      setEditedText('');
      queryClient.invalidateQueries(['comments', postId]);
    },
    onError: (err) => {
      console.error('Error updating comment:', err);
      alert('Failed to update comment.');
    }
  });

  const deleteComment = useMutation({
  mutationFn: (id) =>
    axios.delete(`${API_URL}/comment/${id}`, {
      withCredentials: true,
    }),
  onSuccess: () => {
    queryClient.invalidateQueries(['comments', postId]);
  },
  onError: (err) => {
    console.error('Error deleting comment:', err);
    alert('Failed to delete comment.');
  }
});


  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment.mutate({
      comment: newComment,
      author: user.username,
      postId: postId,
      userId: user._id,
    });
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment._id);
    setEditedText(comment.comment);
  };

  const handleUpdate = (id) => {
    if (!editedText.trim()) return;
    updateComment.mutate({ id, comment: editedText });
  };

  const handleDelete = (id) => {
  deleteComment.mutate(id);
}

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error.message}</p>;

  return (
    <div>
      <div className="mt-8">
        <h3 className="font-semibold text-xl mb-4">Comments:</h3>
        {comments?.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="px-4 py-3 bg-gray-100 rounded-lg my-4 shadow-sm"
            >
              <div className="flex justify-between items-center text-gray-600">
                <h3 className="font-bold">@{comment.author}</h3>
                <div className="flex space-x-4 items-center">
                  <p className="text-sm">
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </p>
                  {comment.userId === user._id && (
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(comment)}
                      >
                        <BiEdit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <MdDelete size={18} 
                         onClick={() => handleDelete(comment._id)}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {editCommentId === comment._id ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleUpdate(comment._id)}
                    className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-700">{comment.comment}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Comment Section */}
      <div className="w-full flex flex-col md:flex-row mt-8 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Write a comment"
          className="md:w-[80%] outline-none py-3 px-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-black text-sm text-white px-6 py-3 rounded-lg md:w-[20%] mt-4 md:mt-0 hover:bg-gray-800 transition-all"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default Comments;
