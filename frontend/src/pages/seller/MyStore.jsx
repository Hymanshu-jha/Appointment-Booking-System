import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'; // at the top
import { Outlet, NavLink, useLocation } from 'react-router-dom';


export const Mystore = () => {
  const location = useLocation();

  const isOnMyStoresPage = location.pathname === '/mystore';

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header: Navigation + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        {/* Left: Nav Links */}
        <div className="flex gap-4">
          <NavLink
            to="/mystore"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${
                isActive ? 'bg-purple-700 text-white' : 'bg-gray-800 text-purple-300 hover:bg-gray-700'
              }`
            }
          >
            My Stores
          </NavLink>

          <NavLink
            to="addstore"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition ${
                isActive ? 'bg-purple-700 text-white' : 'bg-gray-800 text-purple-300 hover:bg-gray-700'
              }`
            }
          >
            + Add Store
          </NavLink>
        </div>

        {/* Center: Search Bar - only on /mystore */}
{isOnMyStoresPage && (
  <div className="flex-1 md:mx-8 relative">
    <input
      type="text"
      placeholder="Search your store..."
      className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300"
    >
      <MagnifyingGlassIcon className="h-7 w-7" />
    </button>
  </div>
)}

      </div>

      {/* Content */}
      <Outlet />
    </div>
  );
};
