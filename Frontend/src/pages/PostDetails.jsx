import React, { useContext } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Layout from "../components/Layout";
import { userContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../url";
import Comments from "../components/Comments";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, setUser } = useContext(userContext);

  console.log("user", user);

  const fetchPostDetails = async (id) => {
    const response = await axios.get(`${API_URL}/post/${id}`, {
      withCredentials: true,
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["postDetails", id],
    queryFn: () => fetchPostDetails(id),
    enabled: !!id, // Only fetch data if id is available
  });

  if (isLoading) return <p>Loading post details...</p>;
  if (error) return <p>Error fetching post: {error.message}</p>;

  // Access post data
  const post = data?.post;
  console.log("post", post);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(`${API_URL}/post/${id}`, {
        withCredentials: true,
      });
      console.log(res.data.message);
      navigate("/"); // redirect to homepage after deletion
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };
console.log(`${API_URL}/images/${post?.image}`);

  return (
  <Layout>
  <div className="px-4 sm:px-8 md:px-[200px] py-10 bg-gradient-to-b from-purple-50 to-white min-h-screen">
    {/* Post Header */}
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h1 className="text-3xl font-extrabold text-gray-800 leading-snug">
        {post?.title || "Loading..."}
      </h1>

      {post.userId === user._id && (
        <div className="flex gap-4 text-gray-600">
          <button
            onClick={() => navigate(`/edit/${post?._id}`)}
            className="hover:text-purple-600 transition"
          >
            <BiEdit size={22} />
          </button>
          <button
            onClick={handleDelete}
            className="hover:text-red-500 transition"
          >
            <MdDelete size={22} />
          </button>
        </div>
      )}
    </div>

    {/* Metadata */}
    <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mt-3">
      <span>@{post?.username || "Unknown"}</span>
      <div className="flex gap-4 mt-1 sm:mt-0">
        <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
        <span>{new Date(post?.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>

    {/* Post Image */}
    <div
      className="w-full mt-8 h-[350px] rounded-xl shadow-xl bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${API_URL}/images/${post?.image})`,
      }}
    />

    {/* Description */}
    <p className="mt-8 text-lg text-gray-700 leading-relaxed whitespace-pre-line">
      {post?.desc || "No description available."}
    </p>

    {/* Categories */}
    {post?.categories?.length > 0 && (
      <div className="flex flex-wrap items-center gap-3 mt-10 text-gray-700 font-medium">
        <span className="text-base">Categories:</span>
        {post.categories.map((cat, idx) => (
          <span
            key={idx}
            className="bg-purple-100 text-purple-700 text-sm px-4 py-1 rounded-full shadow-sm"
          >
            {cat}
          </span>
        ))}
      </div>
    )}

    {/* Comments */}
    <div className="mt-12">
      <Comments postId={id} user={user} />
    </div>
  </div>
</Layout>

  );
}

export default PostDetails;
