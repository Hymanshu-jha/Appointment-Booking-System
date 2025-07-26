import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";


const apiUrl = import.meta.env.VITE_API_URL;



const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);


   const dropdownRef = useRef(null);  // refers to the dropdown area

  // This runs once when the component loads
  useEffect(() => {
    // This function checks where the user clicked
    function handleClickOutside(event) {
      // If dropdown is open and click is outside dropdown, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    // Add click listener to whole page
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the listener when component is removed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isUserLoggedIn = () => user !== null;

  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiUrl}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");

      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const linkBase =
    "text-lg font-medium px-3 py-1 rounded transition duration-200";
  const activeLink =
    "text-yellow-400 border-b-2 border-yellow-400";
  const inactiveLink =
    "text-gray-300 hover:text-yellow-300 hover:border-yellow-400";

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50 border-b-2 border-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left nav links */}
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/stores"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Stores
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : inactiveLink}`
            }
          >
            Appointments
          </NavLink>
        </div>

        {/* Right side (Login/Profile) */}
        <div className="relative">
          {!isUserLoggedIn() ? (
            <div className="flex space-x-4">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${linkBase} border border-purple-600 px-4 py-1 ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-purple-400 hover:bg-purple-600 hover:text-white"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full focus:outline-none transition-colors duration-200 ${
                  user?.picture
                    ? ""
                    : "bg-purple-700 text-white hover:bg-purple-600"
                }`}
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  user?.userName?.[0]?.toUpperCase() || "U"
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-[#1a1a1a] text-gray-200 rounded-lg shadow-lg border border-gray-700 z-[9999]">
                  <NavLink
                    to="/mystore"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-purple-700 rounded-t transition"
                  >
                    My Store
                  </NavLink>
                  <NavLink
                    to="/analytics"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-purple-700 transition"
                  >
                    Analytics
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-purple-700 transition"
                  >
                    Settings
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-800 hover:text-white rounded-b transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
