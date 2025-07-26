// ServiceLayout.jsx
import { Outlet, useParams, useLocation } from "react-router-dom";

const ServiceLayout = () => {
  const { serviceName } = useParams();
  const location = useLocation();

  // More specific check - adjust the path pattern as needed
  const isBookingRoute = location.pathname.endsWith('/booking') || 
                        location.pathname.includes('/booking/');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!isBookingRoute && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Service : <span className="font-mono text-blue-700">{serviceName}</span>
          </h2>
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default ServiceLayout;