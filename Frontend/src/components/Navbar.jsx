import React, { useContext, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Menu from "./Menu";
import { userContext } from "../context/userContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../url";

function Navbar() {
  const [menu, setMenu] = useState(false);
  const { user, setUser } = useContext(userContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        API_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setUser(null); // Clear user context
      navigate("/login")
      console.log("User logged out.");
    },
    onError: (error) => {
      console.error("Logout error:", error.response?.data || error.message);
    },
  });

  function handleLogout() {
    logoutMutation.mutate();
  }

  const path = useLocation().pathname;

  // console.log(prompt)

  const showMenu = () => {
    setMenu(!menu);
  };




const handleSearchChange = (e) => {
  const value = e.target.value;
  if (value) {
    searchParams.set("search", value);
    setSearchParams(searchParams);
  } else {
    searchParams.delete("search");
    setSearchParams(searchParams);
  }
};

 return (
  <header className="w-full bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-purple-100">
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-screen-xl mx-auto">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
        <Link to="/">Blogory</Link>
      </h1>

      {/* Search (only on home route) */}
      {path === "/" && (
        <div className="hidden sm:flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-inner focus-within:ring-2 focus-within:ring-purple-400 transition">
          <BsSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search a post"
            defaultValue={searchParams.get("search") || ""}
            onChange={handleSearchChange}
            className="outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      )}

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
        {user ? (
          <>
            <Link
              to="/write"
              className="hover:text-purple-600 transition duration-200"
            >
              Write
            </Link>
            <Link
              to="/profile"
              className="hover:text-purple-600 transition duration-200"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-purple-600 transition duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-purple-600 transition duration-200"
            >
              Register
            </Link>
          </>
        )}
      </nav>

      {/* Mobile Menu */}
      <div onClick={showMenu} className="md:hidden text-xl text-gray-700">
        <button className="p-2 hover:text-purple-600 transition">
          <FaBars />
        </button>
        {menu && <Menu user={(user, handleLogout)} />}
      </div>
    </div>
  </header>
);

}

export default Navbar;
