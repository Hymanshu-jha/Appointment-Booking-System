import { NavLink, Outlet } from "react-router-dom";

const Appointments = () => {
  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">
        Your Appointments
      </h2>

      {/* Navigation */}
      <div className="flex justify-center gap-6 mb-8">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg ${
              isActive ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"
            }`
          }
        >
          Bought
        </NavLink>

        <NavLink
          to="sold"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg ${
              isActive ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"
            }`
          }
        >
          Sold
        </NavLink>
      </div>

      {/* Nested pages will render here */}
      <Outlet />
    </div>
  );
};

export default Appointments;
