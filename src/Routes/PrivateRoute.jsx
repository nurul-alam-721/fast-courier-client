import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center text-xl py-10">Loading...</div>;
  }

  if (!user) {
   return <Navigate state={{ from: location.pathname }} to="/login" />

  }

  return children;
};

export default PrivateRoute;
