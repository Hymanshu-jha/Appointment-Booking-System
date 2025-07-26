import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export const AddService = () => {

  const { storeId } = useParams();

  const [servicename, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [servicetime, setServiceTime] = useState(0);
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if(
      servicename === '' 
      || description === '' 
      || price === 0 
      || currency === '' 
      || servicetime === 0 
      || startHour === null 
      || endHour === null
      || storeId === ''
  ){
      alert('Please fill all the fields');
      return;
    }

    // create services
    const res = await fetch('http://localhost:5001/api/v1/service/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({storeId, servicename, description, price, currency, servicetime, startHour, endHour}),
    })

    if(res.ok){
      alert('Service added successfully');
    }else{
      alert('Failed to add service');
    }


  }



  return (
    <div className="text-gray-300">
     
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Service Name */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Service Name</label>
          <input
            type="text"
            name="servicename"
            value={servicename}
            onChange={e => setServiceName(e.target.value)}
            placeholder="Enter service name"
            className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="3"
            placeholder="Describe your service"
            className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Price</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            placeholder="e.g. 499"
            className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Currency</label>
          <select
            name="currency"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>

        {/* Service Time */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Service Time (minutes)</label>
          <input
            type="number"
            name="servicetime"
            value={servicetime}
            onChange={e => setServiceTime(Number(e.target.value))}
            placeholder="e.g. 45"
            className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>


        {/* Working Hours */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400">Start Hour (0–24)</label>
            <input
              type="number"
              name="startHour"
              value={startHour === null ? '' : startHour}
              onChange={e => setStartHour(e.target.value === '' ? null : Number(e.target.value))}
              placeholder="e.g. 10"
              min="0"
              max="24"
              className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400">End Hour (0–24)</label>
            <input
              type="number"
              name="endHour"
              value={endHour === null ? '' : endHour}
              onChange={e => setEndHour(e.target.value === '' ? null : Number(e.target.value))}
              placeholder="e.g. 18"
              min="0"
              max="24"
              className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-400">Image URL (optional)</label>
          <input
            type="text"
            name="imageUrl"
            // No state for imageUrl, so leave uncontrolled or add state if needed
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full bg-black border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cursor-pointer bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-600 text-black px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
