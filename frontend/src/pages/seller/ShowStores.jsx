import React, { useEffect, useState } from 'react';
import { StoreCard } from '../../components/StoreCard';

const apiUrl = import.meta.env.VITE_API_URL;

export const ShowStores = () => {
  const [mystore, setMyStore] = useState([]);

  // Fetch stores owned by the logged-in user
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${apiUrl}/store/listAll`, {
          credentials: 'include',
        });

        if (!res.ok) {
          console.error('Error while fetching store data');
          throw new Error('Failed to fetch store data');
        }

        const data = await res.json();

        if (data.success) {
          console.log('storesArray: ', data.stores);
          setMyStore(data.stores);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="p-6">
     

      {mystore.length === 0 ? (
        <p className="text-gray-400">No stores found. Add one!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mystore.map((store, index) => (
            <StoreCard
              key={store._id}
              store={store}
            />
          ))}
        </div>
      )}
    </div>
  );
};
