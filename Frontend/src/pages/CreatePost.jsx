import React, { useContext, useState } from "react";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { userContext } from "../context/userContext";
import { API_URL } from "../url";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const {user}=useContext(userContext)
  const navigate = useNavigate();

  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i, 1); // Fixing the issue here
    setCats(updatedCats);
  };

  const addCategory = () => {
    if (cat.trim()) {
      let updatedCats = [...cats];
      updatedCats.push(cat);
      setCat("");
      setCats(updatedCats);
    }
  };
  const createPost = async ({ file, post }) => {
    if (file) {
      const formData = new FormData();
       const originalName = file.name.replace(/\s+/g, "-"); // Replace spaces with dashes
     const filename = `${Date.now()}-${originalName}`;
      formData.append("image", filename);
      formData.append("file", file);
      post.image = filename;
      await axios.post(`${API_URL}/upload`, formData);
    }
  
    const res = await axios.post(`${API_URL}/post/create`, post, {
      withCredentials: true,
    });
    return res.data;
  };


  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      navigate(`/post/${data.post.id}`);
    },
  });


  const handleCreate = (e) => {
    e.preventDefault();
  
    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats,
    };
  
    mutate({ file, post });
  };
  return (
 <Layout>
  <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex justify-center py-12 px-4">
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Create a Post
      </h1>

      <form className="space-y-6" onSubmit={handleCreate}>
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              placeholder="Enter category"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={addCategory}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-md hover:from-pink-600 hover:to-purple-600 transition"
            >
              Add
            </button>
          </div>

          {cats.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {cats.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1 rounded-full"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => deleteCategory(i)}
                    className="text-xs bg-purple-700 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <ImCross size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={6}
          placeholder="Enter post description"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Error Message */}
        {isError && (
          <p className="text-red-500 text-sm font-medium">
            Error: {error.message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          {isLoading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  </div>
</Layout>

  );
}

export default CreatePost;
