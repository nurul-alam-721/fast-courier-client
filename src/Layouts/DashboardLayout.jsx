import React from "react";
import Logo from "../Pages/Shared/Logo/Logo";
import { NavLink, Outlet } from "react-router-dom";
import {
  MdHome,
  MdLocalShipping,
  MdSend,
  MdPayment,
  MdSearch,
  MdPerson,
} from "react-icons/md";

const DashboardLayout = () => {
  const activeClass =
    "btn btn-primary justify-start w-full text-left flex items-center gap-2 text-black";
  const inactiveClass =
    "btn btn-ghost justify-start w-full text-left flex items-center gap-2";

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
          <Outlet />
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
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <MdHome size={20} />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/myParcels"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <MdLocalShipping size={20} />
                My Parcels
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sendParcel"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <MdSend size={20} />
                Send Parcel
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/paymentHistory"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <MdPayment size={20} />
                Payment History
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/track"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <MdSearch size={20} />
                Track A Parcel
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <MdPerson size={20} />
                Update Profile
              </NavLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
