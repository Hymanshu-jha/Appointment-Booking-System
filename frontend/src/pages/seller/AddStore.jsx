import React, { useState, useRef , useCallback } from 'react';
import { categories } from '../../components/StoreCard';
import LeafLet from '../map/leaflet';

const apiUrl = import.meta.env.VITE_API_URL;

export const AddStore = () => {

  const coordinates = useRef(null);
  const address = useRef(null);

  const [storename, setStoreName] = useState('');
  const [category, setCategory] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [description, setDescription] = useState('');
  const [locationData, setLocationData] = useState(null);


  const [errMessage, setErrMessage] = useState('');

  // post request to create a store

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!storename 
      || !category 
      || !description
      || !address?.current 
      || !coordinates?.current
    ) {
      return;
    }

  try {
    const res = await fetch(`${apiUrl}/v1/store/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',  // ✅ Place it outside headers
      body: JSON.stringify({
        storename,
        category,
        coordinates: coordinates?.current,
        address: address?.current,
        description,
      }),
    });

    if (!res.ok) {
      throw new Error('Error while creating store');
    }

    const data = await res.json();

    console.log('Store created successfully!', data?.savedStore);
  } catch (err) {
    console.error(err.message);
  }
  };

const handleAddressData = useCallback((data) => {
  address.current = data.address;
  coordinates.current = data.latlang;
  setLocationData(data); // this will now only update if different
}, []);



const isFormReady = storename && category && description && address.current && coordinates.current;




  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 pt-10 space-y-6">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-purple-500/40 shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-4">Add a Store</h2>

        <input
          type="text"
          placeholder="Store name"
          value={storename}
          onChange={(e) => setStoreName(e.target.value)}
          className="w-full p-3 rounded-xl bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div>
          <label htmlFor="store" className="block text-purple-300 mb-2">Choose a Category:</label>
          <select
            id="store"
            name="store"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-xl bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">-- Select a Category --</option>
            {categories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>

<label htmlFor="description" className="block text-purple-300 mb-2">
  Add a Description:
</label>
<textarea
  id="description"
  name="description"
  placeholder="Write a description..."
  onChange={(e) => setDescription(e.target.value)}
  value={description}
  rows={4}
  className="w-full p-3 rounded-xl bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
/>


<button
  type="submit"
  disabled={!isFormReady}
  className={`w-full font-semibold py-3 rounded-xl transition duration-300 ${
    !isFormReady
      ? 'bg-purple-300 cursor-not-allowed'
      : 'bg-purple-600 hover:bg-purple-700'
  }`}
>
  Submit
</button>

      </form>

      <button
        onClick={() => setIsClicked(!isClicked)}
        className="mt-4 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-xl shadow text-white transition"
      >
        {isClicked ? 'Hide Location Picker' : 'Set Location'}
      </button>

      {isClicked && (
        <div className="mt-6 w-full max-w-3xl">
          <LeafLet
            onSendAddressData={handleAddressData}
          />
        </div>
      )}
    </div>
  );
};
