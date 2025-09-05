import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 text-white">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>

      {/* Text */}
      <p className="mt-6 text-lg font-semibold tracking-wide animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loading;
