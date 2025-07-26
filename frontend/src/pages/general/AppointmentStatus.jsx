import { useParams, Link, Outlet } from "react-router-dom";

export const AppointmentStatus = () => {
  const { appointmentId } = useParams();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Appointment Status
      </h2>
      <p className="text-gray-700 mb-6">
        Viewing the status of appointment ID:{" "}
        <span className="font-mono text-purple-700">{appointmentId}</span>
      </p>

      <Link
        to="chatpage"
        className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Connect
      </Link>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
};
