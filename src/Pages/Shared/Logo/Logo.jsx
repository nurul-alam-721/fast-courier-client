import React from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
      <div className="flex items-end">
        <img src={logo} alt="" />
        <p className="text-2xl font-bold -ml-2">FASTcourier</p>
      </div>
  );
};

export default Logo;
