import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PaymentNotProcessed = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate(-2); // Go back 2 pages in the history stack
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white px-4">
      <div className="max-w-md w-full bg-gray-950 shadow-2xl rounded-3xl p-10 border border-purple-800">
        <div className="text-center">
          <svg
            className="mx-auto mb-6 w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 3h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.994-1.85L21 18V6a2 2 0 00-1.85-1.995L19 4H5a2 2 0 00-1.995 1.85L3 6v12c0 1.054.816 1.918 1.85 1.994L5 20z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Failed</h2>
          <p className="text-gray-300 mb-6">
            Oops! Your payment could not be processed. Please check your internet connection or try again.
          </p>
          <button
            onClick={handleTryAgain}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentNotProcessed;
