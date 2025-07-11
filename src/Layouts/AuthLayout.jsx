import React from "react";
import { Outlet } from "react-router";
import authImg from './../assets/authImage.png'
import Logo from "../Pages/Shared/Logo/Logo";

const AuthLayout = () => {
  return (
    <div>
      <div className="bg-base-200 p-12">
         <Logo></Logo>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src={authImg}
            className="max-w-sm flex-1 rounded-lg shadow-2xl"
          />
          <div className="flex-1">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
