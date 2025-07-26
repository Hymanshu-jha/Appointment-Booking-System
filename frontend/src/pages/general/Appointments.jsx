// Appointments.jsx
import { Link, Outlet } from "react-router-dom";

const mockAppointments = [
  { id: "1", service: "Dental Cleaning" },
  { id: "2", service: "Haircut" },
];

const Appointments = () => {
  return (
    <div className="p-8 min-h-screen bg-black text-white">
     <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">
  Your Appointments
</h2>

      
      <ul className="space-y-5 max-w-3xl mx-auto">
        {mockAppointments.map((appt) => (
          <li
            key={appt.id}
            className="flex justify-between items-center bg-black/70 border border-purple-700 p-5 rounded-xl shadow-lg backdrop-blur-sm"
          >
            <span className="text-white font-semibold text-lg">
              {appt.service}
            </span>
            <Link
              to={`${appt.id}/status`}
              className="px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-lg hover:from-purple-800 hover:to-purple-950 transition-transform transform hover:scale-105"
            >
              Status
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Appointments;
