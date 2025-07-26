import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Search, Filter, MapPin, Star, Clock, Phone, Globe, ChevronDown, Grid3X3, List } from 'lucide-react';
import { StoreCard } from '../../components/StoreCard';


const apiUrl = import.meta.env.VITE_API_URL;


const categories = [
  'all',
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


export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
  if (!searchTerm) {
    // If search is empty, show all filtered by price or other filters
    setFilteredStores(stores);
    return;
  }

  const options = {
    keys: ['name', 'description', 'category'], // fields to search in
    threshold: 0.4, // fuzzy matching level (0 = exact, 1 = very fuzzy)
    distance: 100,  // how far apart matched characters can be
  };

  const fuse = new Fuse(stores, options);
  const result = fuse.search(searchTerm);

  // result = [{ item: {...serviceData} }, ...]
  const matches = result.map(r => r.item);

  setFilteredStores(matches);
}, [searchTerm, stores]);



  // Simulate API fetch
  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      
      const response = await fetch(`${apiUrl}/store/`, {
        method: 'GET'
      });
      const data = await response.json();
      if(data.success) {
        setStores(data.stores);
      } else {
        console.log(`error while fetching stores`);
        return;
      }

      setIsLoading(false);
    };
    
    fetchStores();
  }, []);

  // Filter 
  useEffect(() => {
    let filtered = stores;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(store => store.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredStores(filtered);
  }, [stores, selectedCategory, sortBy]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900/20 via-black to-purple-900/20 border-b border-purple-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Discover Local
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Stores</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Find the perfect local businesses and services in your area. From salons to clinics, we've got you covered.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for services, businesses, or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
          {/* Category Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300 font-medium">Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-900 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 capitalize"
            >
              {categories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-purple-500/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredStores.length}</span> 
            {selectedCategory !== 'all' && (
              <span> {selectedCategory}</span>
            )} results
            {searchTerm && (
              <span> for "<span className="text-purple-400">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Stores Grid/List */}
        {!isLoading && (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <StoreCard  
                key={store._id} 
                viewMode={viewMode}  
                store={store}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-gray-400 text-lg mb-4">No stores found</div>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
           
          </div>
        )}
      </div>
    </div>
  );
}

