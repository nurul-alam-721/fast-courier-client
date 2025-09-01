import React from "react";
import useUserRole from "../hooks/useUserRole";
import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== "admin") {
    return <Navigate state={{ from: location.pathname }} to="/forbidden" />;
  }

  return children;
};

export default AdminRoute;
