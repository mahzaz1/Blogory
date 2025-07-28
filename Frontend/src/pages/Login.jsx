import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../url";
import { userContext } from "../context/userContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);

  const loginMutation = useMutation({
    mutationFn: async (user) => {
      const response = await axios.post(API_URL + "/login", user, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("data", data);
      navigate("/");
      setUser(data);
    },
    onError: () => {
      console.error("Error loging in:", error.response?.data || error.message);
    },
  });

  function handleLogin(e) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 px-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 backdrop-blur-md bg-opacity-80 border border-gray-200">
    <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
      Log in to your account
    </h1>

    <form onSubmit={handleLogin} className="space-y-5">
      <div className="relative">
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-purple-500 peer-valid:text-xs peer-valid:top-1">
          Email
        </label>
      </div>

      <div className="relative">
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-purple-500 peer-valid:text-xs peer-valid:top-1">
          Password
        </label>
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
      >
        {loginMutation.isPending ? "Loading..." : "Login"}
      </button>
    </form>

    {loginMutation.isError && (
      <div className="mt-4 text-center text-sm text-red-600 font-medium bg-red-100 border border-red-300 p-2 rounded-md">
        {loginMutation.error?.response?.data?.error || "Something went wrong"}
      </div>
    )}

    <p className="text-center mt-6 text-gray-600 text-sm">
      New here?{" "}
      <Link
        to="/register"
        className="text-purple-700 font-medium hover:underline"
      >
        Register
      </Link>
    </p>
  </div>
</div>

  );
}

export default Login;
