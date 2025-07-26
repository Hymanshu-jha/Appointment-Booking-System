import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ServiceCard } from '../../components/ServiceCard';


const apiUrl = import.meta.env.VITE_API_URL;


export const MyServicePage = () => {

  const [services, setServices] = useState([]);
  const location = useLocation();
  const address = location?.state?.store?.location?.address;


  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch(`${apiUrl}/service/myservices`, {
        credentials: 'include',
      });
      const data = await response.json();
      setServices(data?.services);
      console.log(data);
    };
    fetchServices();
  }, []);

  
  return (
    <div className="min-h-screen bg-black text-gray-300 px-6 py-8">
  

      {services.length === 0 ? (
        <p className="text-center text-purple-300 mt-10">No services found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} address={address} />
          ))}
        </div>
      )}
    </div>
  );
};
