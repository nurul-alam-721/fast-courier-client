import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import useAuth from "../Hooks/useAuth";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!user || role !== "rider") {
    return <Navigate to="/forbidden" state={{ from: location.pathname }} />;
  }

  return children;
};

export default RiderRoute;
