// components/PrivateRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userContext } from "./userContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(userContext);


  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
