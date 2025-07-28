import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../context/userContext";
import { API_URL } from "../url";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


function ProfilePosts() {
  const { user } = useContext(userContext);

  const fetchPosts = async () => {
    const res = await axios.get(`${API_URL}/post/user/${user._id}`, {
      withCredentials: true,
    });
    return res.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
if(data.posts.length === 0) return <div className=" text-gray-500">No posts available.</div>;
  return (
    <>
    {data?.posts?.map((data,index)=>(
      <div key={index} className="w-full flex flex-col md:flex-row mt-8 space-y-6 md:space-y-0 md:space-x-6">
      {/* Image Section */}
      <div className="w-full md:w-[35%] h-[200px] rounded-lg overflow-hidden shadow-lg">
        <img
            src={`${API_URL}/images/${data?.image}`}
          alt="Post Thumbnail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Text Section */}
      <div className="flex flex-col w-full md:w-[65%] space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.title}</h1>

        {/* Post Info (Author, Date, Time) */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p className="font-semibold">{data.username}</p>
          <div className="flex space-x-4">
          <p>{new Date(data?.createdAt).toLocaleDateString()}</p>
          <p>{new Date(data?.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Post Description */}
        <p className="text-lg text-gray-700 leading-relaxed">
          {data.desc}
        </p>

        {/* Read More Link */}
        <Link
            to={`/post/${data?._id}`}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Read more
        </Link>
      </div>
    </div>

    ))}
   </>
  );
}

export default ProfilePosts;
