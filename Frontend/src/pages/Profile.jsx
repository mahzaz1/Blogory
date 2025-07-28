import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePosts from "../components/ProfilePosts";
import Layout from "../components/Layout";
import { userContext } from "../context/userContext";
import axios from "axios";
import { API_URL } from "../url";

function Profile() {
  const param = useParams().id;
  const { user, setUser } = useContext(userContext);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);

  const handleUserUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/user/${user._id}`,
        { username },
        { withCredentials: true } // if your API uses cookies/sessions
      );

      if (response.status === 200) {
        setUser({ ...user, username }); // update user context
        setUpdated(true);
        setTimeout(() => setUpdated(false), 3000);
      } else {
        console.error("Failed to update user:", response.data.error);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(`${API_URL}/user/${user._id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser(null); // clear user context
        navigate("/register"); // or redirect to login/home
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
 <Layout>
  <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Posts Section */}
      <div className="w-full md:w-2/3">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Posts</h2>
        <ProfilePosts />
      </div>

      {/* Profile Section */}
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>

          {/* Username Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          {/* Email Input (Disabled) */}
          <input
            type="email"
            value={email}
            placeholder="Your email"
            disabled
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
          />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUserUpdate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-md transition"
            >
              Update
            </button>
            <button
              onClick={handleUserDelete}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md transition"
            >
              Delete
            </button>
          </div>

          {updated && (
            <p className="text-green-600 text-sm text-center font-medium pt-2">
              User updated successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
</Layout>

  );
}

export default Profile;
