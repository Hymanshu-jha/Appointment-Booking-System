import React , {useState, useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

export const categories = [
  'salon',
  'counselling',
  'physiotherapy',
  'dental clinic',
  'spa',
  'legal consultant',
  'nutritionist',
  'diagnostic center',
  'veterinary clinic',
  'home cleaning',
  'appliance repair',
  'driving school',
  'photography studio',
  'makeup artist',
  'tattoo studio',
  'massage therapy',
  'astrology',
];

export const StoreCard = ({ store }) => {
  const {
    name,
    _id,
    ownername,
    location,
    services = [],
    rating,
    description,
    category,
  } = store;


const routeLocation = useLocation();

const [isMyStore, setIsMyStore] = useState(true);
const [serviceLink, setServiceLink] = useState('');

useEffect(() => {
  if (routeLocation.pathname === '/mystore') {
    setIsMyStore(true);
    setServiceLink(`/mystore/${store._id}/${store.name}/myservices`);
  } else {
    setIsMyStore(false);
    setServiceLink(`/services`);
  }
}, [routeLocation.pathname, store._id, store.name]);


  const handleDeleteStore = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/store/delete/${_id}`, {
        credentials: 'include',
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(`Error deleting store ${name}`);

      const data = await res.json();
      if (data.success) {
        console.log(`Deleted store: ${name}`);
        if (onDelete) onDelete(_id); // notify parent to refresh list
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="bg-[#0e0e0e] border border-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-md p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{name}</h2>
        {ownername && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
              {ownername.charAt(0)}
            </div>
            <span>{ownername}</span>
          </div>
        )}
      </div>

      {/* Address */}
      {location?.address && (
        <div className="text-sm text-gray-400">
          <span className="text-white font-medium">Address:</span> {location.address}
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="text-sm text-gray-300">
          <span className="text-white font-medium">About:</span> {description}
        </div>
      )}

      {/* Category */}
      {category && (
        <div className="text-xs text-purple-400 uppercase tracking-wide">
          {category}
        </div>
      )}

      {/* Services + Rating */}
      <div className="flex items-center justify-between mt-4">
       <NavLink
  to={serviceLink}
  state={{
    store
  }}
  className="text-lg text-purple-400 font-semibold hover:underline"
>
  View Services
</NavLink>

        <div className="flex items-center gap-1 text-sm text-yellow-400">
          <span className="text-lg">⭐</span>
          <span>{rating ?? 'N/A'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 items-center mt-2">
        <button
          onClick={handleDeleteStore}
          className="text-red-500 hover:text-red-400 transition cursor-pointer"
          title="Delete Store"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        {/* Optional Edit Button */}
        {/* <NavLink
          to={`/edit-store/${_id}`}
          className="text-blue-400 hover:text-blue-300 transition"
          title="Edit Store"
        >
          <Pencil className="w-5 h-5" />
        </NavLink> */}
      </div>
    </div>
  );
};
