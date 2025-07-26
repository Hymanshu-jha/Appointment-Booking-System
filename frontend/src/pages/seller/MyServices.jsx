import React from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';


export const MyServices = () => {
  const { storeId , storeName } = useParams();


  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-500 mb-6 border-b border-purple-700 pb-2">
          Store: {storeName}
        </h1>

        <div className="flex gap-4 mb-8">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`
            }
          >
            View Services
          </NavLink>

          <NavLink
            to="addservices"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-green-600 text-black hover:bg-green-400'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`
            }
          >
            Add New Service
          </NavLink>
        </div>

        <div className="bg-[#0e0e0e] rounded-xl shadow-lg p-6 border border-purple-700">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
