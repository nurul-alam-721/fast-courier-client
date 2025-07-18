import React from "react";
import Logo from "../Pages/Shared/Logo/Logo";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content area */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-200 lg:hidden px-4">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 text-xl font-semibold">Dashboard</div>
        </div>

        {/* Page content */}
        <main className="p-4 w-full">
          <Outlet></Outlet>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r">
          {/* Logo */}
          <div className="mb-6">
            <Logo />
          </div>

          {/* Navigation */}
          <ul className="space-y-2">
            <li>
              <Link to="/" className="btn btn-ghost w-full text-left">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard/myParcels" className="btn btn-ghost w-full text-left">
                My Parcels
              </Link>
            </li>
            <li>
              <Link to="/sendParcel" className="btn btn-ghost w-full text-left">
                Send Parcel
              </Link>
            </li>
            
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
