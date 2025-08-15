import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";




const apiUrl = import.meta.env.VITE_API_URL;

const Booking = () => {
  // In real implementation, this would come from useLocation
  const location = useLocation();
  const { selectedDate, selectedSlot, serviceId, serviceName } = location.state || {};
console.log("Booking page mounted", location?.state);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingService, setFetchingService] = useState(true);
  
  const serviceRef = useRef(null);
  const [readyToProceed, setReadyToProceed] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setFetchingService(true);
        setError("");
        
        const res = await fetch(`${apiUrl}/service/getServiceDetails/${serviceId}`, {
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.service) {
          serviceRef.current = data.service;
          setReadyToProceed(true);
        } else {
          setError("Service not found or not authorized");
        }
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Failed to load service details. Please try again.");
      } finally {
        setFetchingService(false);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    } else {
      setError("No service ID provided");
      setFetchingService(false);
    }
  }, [serviceId]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price, currency) => {
    const symbol = currency === "USD" ? "$" : "₹";
    return `${symbol}${price.toFixed(2)}`;
  };

  const handleProceedToPayment = async () => {
    if (!readyToProceed || !serviceRef.current) {
      setError("Service details not loaded yet");
      return;
    }

    setLoading(true);
    setError("");

    const service = serviceRef.current;
    
    // Convert price to cents based on currency
    const priceInCents = service.currency === "USD" 
      ? Math.round(service.price * 100) 
      : Math.round(service.price); // INR is already in paisa/cents

    const items = [
      {
        name: service.name,
        description: service.description,
        price: priceInCents*100,
        quantity: 1,
        currency: service.currency.toLowerCase(),
      },
    ];

    try {
      const response = await fetch(`${apiUrl}/appointment/stripepaymentintent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
           // This should come from your auth context
          serviceId,
          storeId: service.store._id || service.store,
          appointmentTime: selectedSlot,
          appointmentDate: selectedDate,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create payment");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      setError(err.message || "An error occurred while processing your request.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    // In real implementation: navigate(-1)
    window.history.back();
  };

  // Loading state while fetching service
  if (fetchingService) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <div className="bg-gray-950/90 backdrop-blur-sm border border-purple-900/60 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-800 border-t-purple-400 rounded-full animate-spin"></div>
              <h2 className="text-xl font-semibold text-purple-400 mb-2">Loading Service Details</h2>
              <p className="text-gray-400">Please wait while we fetch your service information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state if service fetch failed
  if (error && !readyToProceed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <div className="bg-gray-950/90 backdrop-blur-sm border border-red-900/60 rounded-3xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 text-red-400">⚠️</div>
              </div>
              <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Service</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={goBack}
                className="px-6 py-3 bg-purple-800 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const service = serviceRef.current;

  if (!service) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <div className="w-4 h-4 border-l-2 border-b-2 border-current rotate-45"></div>
          Back
        </button>

        {/* Main Card */}
        <div className="bg-gray-950/90 backdrop-blur-sm border border-purple-900/60 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
              Confirm Booking
            </h1>
            <p className="text-gray-400">Review your service details</p>
          </div>

          {/* Service Image */}
          {service.imageUrl && (
            <div className="mb-6">
              <img 
                src={service.imageUrl} 
                alt={service.name}
                className="w-full h-32 object-cover rounded-xl border border-gray-800"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Service Details */}
          <div className="space-y-6 mb-8">
            {/* Service Name & Rating */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">Service</div>
              <div className="text-2xl font-bold text-white mb-2">{service.name}</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-yellow-400 font-semibold">{service.rating || 'N/A'}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">{service.serviceTime} minutes</span>
              </div>
              <div className="inline-block px-3 py-1 bg-purple-900/40 border border-purple-800/50 rounded-full text-purple-300 text-sm">
                ID: {serviceId}
              </div>
            </div>

            {/* Store Information */}
            {service.store && (
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-2">Store</div>
                <div className="text-gray-300 text-sm">
                  {typeof service.store === 'object' ? service.store.name : 'Store Information'}
                </div>
              </div>
            )}

            {/* Description */}
            {service.description && (
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-2">Description</div>
                <div className="text-gray-300 text-sm leading-relaxed">
                  {service.description}
                </div>
              </div>
            )}

            <div className="h-px bg-gray-800"></div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Date</div>
                <div className="text-white font-semibold">
                  {formatDate(selectedDate)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Time</div>
                <div className="text-white font-semibold">
                  {selectedSlot.start} - {selectedSlot.end}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-800"></div>

            {/* Price */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">Total Amount</div>
              <div className="text-4xl font-bold text-purple-400">
                {formatPrice(service.price, service.currency)}
              </div>
            </div>

            {/* Working Hours */}
            {service.workingHours && (
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Working Hours</div>
                <div className="text-gray-300 text-sm">
                  {service.workingHours.start}:00 - {service.workingHours.end}:00
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800/40 rounded-xl">
              <div className="text-red-400 text-sm text-center">{error}</div>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleProceedToPayment}
            disabled={loading || !readyToProceed}
            className="group relative overflow-hidden w-full bg-gradient-to-r from-purple-800 via-purple-900 to-purple-900 text-white font-semibold py-4 rounded-2xl shadow-2xl shadow-purple-900/50 border border-purple-800/60 transition-all duration-300 hover:shadow-purple-900/70 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : !readyToProceed ? (
                <span>Loading Service...</span>
              ) : (
                <>
                  <span className="text-lg">Proceed to Payment</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white rotate-45"></div>
                  </div>
                </>
              )}
            </div>
            {!loading && readyToProceed && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>

          {/* Security Message */}
          <div className="text-center text-gray-500 text-sm mt-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 text-green-400">🔒</div>
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;