import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImCross } from "react-icons/im";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../url";
import { useMutation } from "@tanstack/react-query";

function EditPost() {
  const postId = useParams().id;
  //   const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const { id } = useParams();


  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i);
    setCats(updatedCats);
  };

  const addCategory = () => {
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
    setCats(updatedCats);
  };


const fetchPostDetails = async () => {
  const res = await axios.get(`${API_URL}/post/${id}`, { withCredentials: true });
  return res.data.post;
};

const { data: post, isLoading } = useQuery({
  queryKey: ["editPost", id],
  queryFn: fetchPostDetails,
  enabled: !!postId,
});

useEffect(() => {
  if (post) {
    setTitle(post.title || "");
    setDesc(post.desc || "");
    setCats(post.categories || []);
  }
}, [post]);


const updatePost = async ({ postId, updatedPost, file }) => {
  // Upload image if present
  if (file) {
    const data = new FormData();
    const filename = Date.now() + "-" + file.name;
    data.append("image", filename);
    data.append("file", file);
    updatedPost.image = filename;

    await axios.post(`${API_URL}/upload`, data);
  }

  const res = await axios.put(`${API_URL}/post/${postId}`, updatedPost, {
    withCredentials: true,
  });

  return res.data;
};


const { mutate, isPending, error } = useMutation({
  mutationFn: ({ postId, updatedPost, file }) => updatePost({ postId, updatedPost, file }),
  onSuccess: () => {
    navigate(`/post/${id}`);
  },
});

const handleUpdate = (e) => {
  e.preventDefault();
  const updatedPost = {
    title,
    desc,
    categories: cats,
  };

  mutate({ postId, updatedPost, file });
};

  return (
 <Layout>
  <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex justify-center items-start py-12 px-4">
    <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Update Post
      </h1>

      <form className="space-y-6" onSubmit={handleUpdate}>
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
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        {/* Categories Input */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              placeholder="Enter a category"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              type="text"
            />
            <button
              type="button"
              onClick={addCategory}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-md hover:from-pink-600 hover:to-purple-600 transition"
            >
              Add
            </button>
          </div>

          {/* Category Chips */}
          {cats?.length > 0 && (
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

        {/* Status & Error */}
        {isPending && (
          <p className="text-sm text-gray-600 font-medium">Updating post...</p>
        )}
        {error && (
          <p className="text-sm text-red-600 font-medium">
            Error: {error.message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          {isPending ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  </div>
</Layout>

  );
}

export default EditPost;
