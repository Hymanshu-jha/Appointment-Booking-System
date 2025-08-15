import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;


const ServiceDetails = () => {
  const { serviceId, serviceName } = useParams();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  function formatDate(date) {
  const year = date.getFullYear();
  // Months are zero-based in JS, so add 1 and pad with 0
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // e.g. 2025-08-11
}


  // Get next 3 days
  const nextThreeDays = [...Array(3)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const fetchSlots = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/appointment/getfreeslots?serviceId=${serviceId}&date=${formatDate(
          selectedDate
        )}`,
        {
          credentials: 'include'
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('freeSlots:', data?.freeSlots);

      setSlots(data?.freeSlots || []);
      setSelectedSlot(null); // reset on date change
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="relative px-8 pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-clip-text text-transparent mb-4">
            Service Details
          </h1>
          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-lg">Service:</span>
            <span className="px-4 py-2 bg-purple-900/40 border border-purple-800/50 rounded-full font-medium text-purple-300 backdrop-blur-sm">
              {serviceName}
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 pb-12">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Date Selection */}
          <div className="bg-gray-950/80 backdrop-blur-sm border border-purple-900/60 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Select Date
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nextThreeDays.map((date, index) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`group relative overflow-hidden px-6 py-4 rounded-xl border transition-all duration-300 ${
                    formatDate(selectedDate) === formatDate(date)
                      ? "bg-gradient-to-r from-purple-800 to-purple-900 border-purple-700 text-white shadow-lg shadow-purple-900/50"
                      : "bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800/80 hover:border-purple-800/60"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="text-sm font-medium opacity-80 mb-1">
                      {index === 0 ? "Today" : index === 1 ? "Tomorrow" : "Day After"}
                    </div>
                    <div className="text-lg font-semibold">
                      {date.toDateString().slice(0, 10)}
                    </div>
                  </div>
                  {formatDate(selectedDate) !== formatDate(date) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-900/10 to-purple-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-gray-950/80 backdrop-blur-sm border border-purple-900/60 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Available Time Slots
            </h3>

            {slots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-700 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-lg">No slots available for this day</p>
                <p className="text-gray-600 text-sm mt-2">Please try selecting a different date</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (slot.available) setSelectedSlot(slot);
                    }}
                    className={`group relative overflow-hidden py-4 px-3 rounded-xl border transition-all duration-300 ${
                      slot.available
                        ? selectedSlot === slot
                          ? "bg-gradient-to-r from-purple-800 to-purple-900 border-purple-700 text-white shadow-lg shadow-purple-900/50 scale-105"
                          : "bg-blue-900/20 border-blue-800/40 text-blue-400 hover:bg-blue-900/30 hover:border-blue-700/60 hover:scale-105"
                        : "bg-red-900/20 border-red-800/40 text-red-400 cursor-not-allowed opacity-60"
                    }`}
                    disabled={!slot.available}
                  >
                    <div className="relative z-10 text-center">
                      <div className="font-semibold text-sm">
                        {slot.start} - {slot.end}
                      </div>
                      <div className="text-xs mt-1 opacity-80">
                        {slot.available ? "Available" : "Booked"}
                      </div>
                    </div>

                    {slot.available && selectedSlot !== slot && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-800/0 via-blue-800/10 to-blue-800/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Book Button */}
          {selectedSlot && (
            <div className="flex justify-center pt-4">
              <Link
                to={`/services/${serviceId}/${serviceName}/booking`}
                state={{
                  selectedDate,
                  selectedSlot,
                  serviceId,
                  serviceName,
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-800 via-purple-900 to-purple-900 text-white font-semibold px-12 py-4 rounded-2xl shadow-2xl shadow-purple-900/50 border border-purple-800/60 transition-all duration-300 hover:shadow-purple-900/70 hover:scale-105"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <span className="text-lg">Book This Service</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white rotate-45"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;