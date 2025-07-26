import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';



export default function LeafLet({ onSendAddressData }) {

  const [sellerLocation, setSellerLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [latlang, setLatlang] = useState(null);


  useEffect(() => {
    if(address && latlang) {
      onSendAddressData({address, latlang});
      console.log(`address data sent from leaflet.jsx to addStore.jsx: ${address, latlang}`);
    }
  }, [latlang, address, onSendAddressData]);



  const reverseGeoCoding = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        method: "GET",
        headers: {
          "User-Agent": "my-appointment-app (himanshujhaa212@gmail.com)",
          "Accept": "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("HTTP error:", res.status, text);
      return;
    }

    const data = await res.json();
    console.log("Reverse geocoding result:", data);
    setAddress(data);
  } catch (error) {
    console.log("Error occurred while reverse geocoding:", error);
  }
};


  
function LocationPicker({ onSelect }) {
  useMapEvents({
    async click(e) {
      console.log("Clicked location:", e.latlng);
      onSelect(e.latlng);
      setLatlang(e.latlng);
      await reverseGeoCoding(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}



  // Example: services array from your backend
  const services = [
  ];



  return (
 <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
        {/* OpenStreetMap tile layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Listen for map clicks */}
        <LocationPicker onSelect={setSellerLocation} />

        {/* Show seller location if selected */}
        {sellerLocation && (
          <Marker position={[sellerLocation.lat, sellerLocation.lng]} />
        )}

        {/* Show existing services markers */}
        {services.map(service => (
          <Marker
            key={service.id}
            position={[service.lat, service.lng]}
          />
        ))}
      </MapContainer>
    </div>
  );
}
