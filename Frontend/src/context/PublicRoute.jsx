// components/PublicRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "./userContext";

const PublicRoute = ({ children }) => {
  const { user } = useContext(userContext);
  return user ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
