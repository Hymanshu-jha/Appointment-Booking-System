import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Search, Filter, Star, Clock, DollarSign, MapPin, User, Grid3X3, List, Sparkles } from 'lucide-react';
import { ServiceCard } from '../../components/ServiceCard';
import { useLocation } from 'react-router-dom';



export default function ServicesDisplayPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const routeLocation = useLocation();


  useEffect(() => {
  if (!searchTerm) {
    // If search is empty, show all filtered by price or other filters
    setFilteredServices(services);
    return;
  }

  const options = {
    keys: ['name', 'description', 'category'], // fields to search in
    threshold: 0.4, // fuzzy matching level (0 = exact, 1 = very fuzzy)
    distance: 100,  // how far apart matched characters can be
  };

  const fuse = new Fuse(services, options);
  const result = fuse.search(searchTerm);

  // result = [{ item: {...serviceData} }, ...]
  const matches = result.map(r => r.item);

  setFilteredServices(matches);
}, [searchTerm, services]);


  // Simulate API fetch - replace with your actual API call
  useEffect(() => {
     const storeId = routeLocation?.state?._id;
    const fetchServices = async () => {
      setIsLoading(true);
      try {
  
        const res = await fetch(`http://localhost:5001/api/v1/service/listAll`, {
          method: 'GET'
        });
        if (!res.ok) {
          console.log(`error while fetching services`);
          return;
        }
        const data = await res.json();
        setServices(data.services);   
        // setFilteredServices(data.services);
        
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);


  
useEffect(() => {
  let updated = [...services];

  // Filtering
  if (priceRange !== 'all') {
    let lowerLimitPrice = 0;
    let upperLimitPrice = Infinity;

    if (priceRange === '2000+') {
      lowerLimitPrice = 2000;
    } else {
      const priceLimits = priceRange.split('-').map(Number);
      lowerLimitPrice = priceLimits[0];
      upperLimitPrice = priceLimits[1];
    }

    updated = updated.filter(service =>
      service.price >= lowerLimitPrice && service.price <= upperLimitPrice
    );
  }

  // Sorting
  switch (sortBy) {
    case 'name':
      updated.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'price':
      updated.sort((a, b) => a.price - b.price); // ascending
      break;
    case 'rating':
      updated.sort((a, b) => b.rating - a.rating); // descending
      break;
    case 'popular':
      updated.sort((a, b) => b.popularity - a.popularity); // assuming popularity field
      break;
    default:
      break;
  }

  const storeId = routeLocation?.state?.store?._id;
  if (storeId) {
    updated = updated.filter(service => service.store === storeId);
  }

  setFilteredServices(updated);
}, [priceRange, sortBy, services, routeLocation]);




  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-900/20 via-black to-orange-900/20 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Premium
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Services</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book professional services from trusted providers. Quality guaranteed, satisfaction assured.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for services, providers, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-amber-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-amber-400" />
              <span className="text-gray-300 font-medium">Filters:</span>
            </div>
          

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-gray-900 border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Prices</option>
              <option value="0-500">Rs.0 - Rs.500</option>
              <option value="500-1000">Rs.500 - Rs.1000</option>
              <option value="1000-2000">Rs.1000 - Rs.2000</option>
              <option value="2000+">Rs.2000+</option>
            </select>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-amber-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-400"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="popular">Sort by Popularity</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-amber-500/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredServices.length}</span> 
            {selectedCategory !== 'all' && (
              <span> {selectedCategory}</span>
            )} services
            {searchTerm && (
              <span> for "<span className="text-amber-400">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        )}

        {/* Services Grid/List */}
        {!isLoading && (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <
                  ServiceCard 
                  key={service._id} 
                  service={service} 
                  viewMode={viewMode} 
                  serviceId={service._id}
                  name={service.name}
                  address={service.location.address}
                  

                  />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-gray-400 text-lg mb-4">No services found</div>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}