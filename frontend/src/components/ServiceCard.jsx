import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaTrash, FaEdit, FaInfoCircle } from "react-icons/fa";

export const ServiceCard = ({ service, onDelete , address }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeId , storeName } = useParams();

  const isMyService = location.pathname.includes(`/mystore/${storeId}/${storeName}/myservices`);

  const {
    name,
    description,
    price,
    currency,
    serviceTime,
    workingHours,
    imageUrl = "https://picsum.photos/300/200", // updated fallback image
    rating = 4.3,
    _id
  } = service;


  const handleEdit = () => {
    navigate(`/edit-service/${_id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      onDelete?.(_id);
    }
  };

  const handleDetails = () => {
    if (isMyService) {
      navigate(`/myservices/${_id}`);
    } else {
      navigate(`/services/${_id}`);
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    navigate(`/services/${_id}/${name}`);
  };

  return (
   <div className="max-w-sm rounded-2xl shadow-sm bg-black text-white border border-purple-700 overflow-hidden hover:shadow-md hover:shadow-purple-600 transition-shadow duration-300">

      <div className="h-48 bg-black relative">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full opacity-80"
        />
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow">
          ★ {rating}
        </div>
      </div>

<div className="p-4 space-y-3">
  <h3 className="text-xl font-bold text-purple-300">{name}</h3>
  {address && (
    <p className="text-xs text-gray-500 font-normal opacity-70">📍 {address}</p>
  )}
  <p className="text-sm text-white">{description}</p>

  <div className="flex justify-between items-center text-sm">
    <span className="text-blue-300 font-semibold">
      {currency === "USD" ? "$" : "₹"}
      {price} {currency}
    </span>
    <span className="text-gray-400">⏱ {serviceTime} min</span>
  </div>

  {workingHours?.start !== undefined && workingHours?.end !== undefined && (
    <div className="text-xs text-gray-500 italic">
      Available: {workingHours.start}:00 - {workingHours.end}:00
    </div>
  )}

        <div className="flex gap-2 mt-4">
          {isMyService ? (
            <>
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-1 bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-1 bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition"
              >
                <FaTrash /> Delete
              </button>
            </>
          ) : (
            <button
              onClick={handleBooking}
              className="w-full py-2 cursor-pointer bg-white text-gray-400 font-bold rounded-md hover:bg-gray-800"
            >
              Book Now
            </button>
          )}
        </div>

        {isMyService && (
          <button
            onClick={handleDetails}
            className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition"
          >
            <FaInfoCircle /> View Details
          </button>
        )}
      </div>
    </div>
  );
};
