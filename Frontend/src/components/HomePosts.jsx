import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL } from "../url";

function HomePosts() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";
  const [filteredPosts, setFilteredPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/post`, {
      withCredentials: true,
    });
    return res.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  // Filter posts on the client side
  useEffect(() => {
    if (data?.posts) {
      const results = data.posts.filter((post) =>
        post.title.toLowerCase().includes(search)
      );
      setFilteredPosts(results);
    }
  }, [data, search]);

  console.log("data",data)

  if (isLoading) return <p>Loading posts...</p>;
  if (data?.posts?.length==0) return <p className="text-center mt-4">No Blogs Available</p>;
  if (error) return <p>Error fetching posts: {error.message}</p>;

return (
  <div className="flex flex-col space-y-10 mt-10">
    {filteredPosts.map((post) => (
      <div
        key={post._id}
        className="w-full flex flex-col md:flex-row gap-6 bg-white/80 border border-gray-200 shadow-lg rounded-xl overflow-hidden transition hover:shadow-xl"
      >
        {/* Image Section */}
      <div
  className="w-full md:w-[35%] h-[300px] md:h-auto bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${API_URL}/images/${post?.image})` }}
/>
        {/* Post Content */}
        <div className="flex flex-col justify-between p-6 w-full md:w-[65%] space-y-4">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text">
            {post?.title}
          </h2>

          <div className="flex justify-between text-sm text-gray-500">
            <p className="font-medium">@{post?.username}</p>
            <div className="flex gap-4">
              <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
              <span>{new Date(post?.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>

          <p className="text-gray-700 text-base leading-relaxed line-clamp-4">
            {post?.desc.length > 200
              ? post.desc.slice(0, 200) + "..."
              : post.desc}
          </p>

          <div>
            <Link
              to={`/post/${post?._id}`}
              className="inline-block mt-2 text-sm font-semibold text-purple-600 hover:text-pink-600 transition"
            >
              Read more →
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>
);

}

export default HomePosts;
