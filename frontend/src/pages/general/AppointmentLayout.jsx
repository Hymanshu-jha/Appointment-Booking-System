import { Outlet, useParams } from "react-router-dom";

export const AppointmentLayout = () => {
  const { appointmentId } = useParams();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-black/70 rounded-2xl shadow-xl backdrop-blur-md p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-400 mb-6">
          Appointment ID:{" "}
          <span className="text-yellow-400">{appointmentId}</span>
        </h1>

        <div className="bg-black/50 rounded-xl p-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
