import React from 'react';
import { Link } from 'react-router-dom';

export const AppointmentCard = ({ appointment }) => {
  const {
    appointmentDate,
    appointmentTime,
    status,
    paymentStatus,
    currency,
    amountPaid,
    service,
  } = appointment;

  const formattedDate = new Date(appointmentDate).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let formattedTime = '';
  if (appointmentTime && typeof appointmentTime === 'object') {
    formattedTime = `${appointmentTime.hours || '00'}:${appointmentTime.minutes || '00'}`;
  } else if (typeof appointmentTime === 'string') {
    formattedTime = appointmentTime;
  }

  const isScheduled = status === 'scheduled';
  const isCompleted = status === 'completed';

  const bgColor = isScheduled ? 'bg-black' : isCompleted ? 'bg-purple-100' : 'bg-white';
  const textColor = isScheduled ? 'text-white' : isCompleted ? 'text-purple-900' : 'text-black';
  const borderColor = isScheduled ? 'border-orange-500' : isCompleted ? 'border-purple-500' : 'border-gray-300';

  return (
    <div
      className={`${bgColor} ${textColor} border ${borderColor} rounded-lg shadow-md p-6
        mx-auto
        hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center gap-4`}
    >
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">{service?.name || 'Service Name'}</h2>

        <p className="text-sm">
          <span className="font-semibold">Date:</span> {formattedDate}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Time:</span> {formattedTime || 'N/A'}
        </p>
        <p className="text-sm capitalize">
          <span className="font-semibold">Status:</span> {status}
        </p>
        <p className="text-sm capitalize">
          <span className="font-semibold">Payment Status:</span> {paymentStatus}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="text-lg font-bold">
          {currency?.toUpperCase() || 'INR'} {(amountPaid / 100).toFixed(2)}
        </p>

        {isScheduled && (
          <span className="px-3 py-1 text-sm bg-orange-500 rounded-full font-semibold">
            Scheduled
          </span>
        )}
        {isCompleted && (
          <span className="px-3 py-1 text-sm bg-purple-500 rounded-full font-semibold text-white">
            Completed
          </span>
        )}

        {/* Chat Button */}
        <Link
          to={`/appointments/${appointment._id}/chatpage`}
          className="mt-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Go to Chat
        </Link>
      </div>
    </div>
  );
};
