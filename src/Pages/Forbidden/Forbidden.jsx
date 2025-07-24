import React from "react";
import { MdBlock } from "react-icons/md";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 text-center">
      <MdBlock className="text-red-600 text-7xl mb-4" />
      <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Forbidden</h1>
      <p className="text-lg text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>
      <Link to="/" className="btn btn-primary text-black">
        Back to Home
      </Link>
    </div>
  );
};

export default Forbidden;
