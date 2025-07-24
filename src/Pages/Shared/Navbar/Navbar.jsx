import React, { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        Swal.fire("Signed out", "You have been logged out", "success");
      })
      .catch((err) => {
        Swal.fire("Error", err.message, "error");
      });
  };

  // Redirect to login when user becomes null
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  const NavItems = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/coverage">Coverage</NavLink></li>
      <li><NavLink to="/sendParcel">Send Parcel</NavLink></li>
      {
        user && <li><NavLink to="/dashboard">Dashoboard</NavLink></li>
      }
      <li><NavLink to="/beARider">Be a Rider</NavLink></li>
      <li><NavLink to="/aboutUs">About Us</NavLink></li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {NavItems}
          </ul>
        </div>
        <NavLink to="/"><Logo /></NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{NavItems}</ul>
      </div>

      <div className="navbar-end space-x-2">
        {!user ? (
          <>
            <NavLink to="/login" className="btn btn-primary text-black">Login</NavLink>
            <NavLink to="/register" className="btn btn-primary text-black">Register</NavLink>
          </>
        ) : (
          <>
            <span className="mr-2 text-sm font-medium hidden lg:inline">{user.email}</span>
            <button onClick={handleSignOut} className="btn btn-outline btn-error btn-sm">Sign Out</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
