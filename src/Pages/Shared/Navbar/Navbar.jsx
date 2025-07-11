import React from 'react';
import { NavLink } from 'react-router';
import Logo from '../Logo/Logo';

const Navbar = () => {
    const NavItems = <>
    <li><NavLink to={'/'}>Home</NavLink></li>
    <li><NavLink to={'/coverage'}>Coverage</NavLink></li>
    <li><NavLink to={'/sendParcel'}>Send Parcel</NavLink></li>
    <li><NavLink to={'/aboutUs'}>About Us</NavLink></li>
    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        {NavItems}
      </ul>
    </div>
    <NavLink to={'/'}><Logo></Logo></NavLink>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      {NavItems}
    </ul>
  </div>
  <div className="navbar-end">
     <button className='btn btn-primary text-black mr-4'><NavLink to={'/login'}>Login</NavLink></button>
    <button className='btn btn-primary text-black'><NavLink to={'/register'}>Register</NavLink></button>
  </div>
</div>
    );
};

export default Navbar;