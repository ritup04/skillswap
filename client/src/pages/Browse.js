import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, MapPin, Clock, Filter, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Browse = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.skill) params.append('skill', filters.skill);
      if (filters.location) params.append('location', filters.location);
      if (filters.availability) params.append('availability', filters.availability);

      const response = await axios.get(`/api/users/browse?${params}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    setFilters({
      skill: searchTerm,
      location,
      availability
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setAvailability('');
    setFilters({});
  };

  const getAvailabilityText = (user) => {
    const avail = user.availability;
    const options = [];
    
    if (avail.weekdays) options.push('Weekdays');
    if (avail.weekends) options.push('Weekends');
    if (avail.evenings) options.push('Evenings');
    if (avail.mornings) options.push('Mornings');
    
    return options.length > 0 ? options.join(', ') : 'Not specified';
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="main-card mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">Browse Skills</h1>
        <p className="text-neutral-500">Find people with the skills you want to learn</p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8 bg-neutral-50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for skills (e.g., Photoshop, JavaScript, Guitar)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 bg-beige-50 text-brown-700 placeholder-brown-300"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary flex items-center justify-center lg:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={handleSearch}
            className="btn btn-primary flex items-center justify-center lg:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="input pl-10"
                  >
                    <option value="">Any availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings</option>
                    <option value="mornings">Mornings</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 text-lg">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="card hover:shadow-card-lg transition-shadow flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center text-3xl text-secondary-500 font-bold shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-primary-600">{user.name}</h2>
                {user.location && (
                  <p className="text-neutral-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </p>
                )}
                <div className="mt-2">
                  <p className="text-sm font-medium text-neutral-700 mb-1">Offers:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.slice(0, 3).map((skill, index) => (
                      <span key={index} className="badge badge-primary text-xs">
                        {skill.name}
                      </span>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <span className="text-xs text-neutral-400">
                        +{user.skillsOffered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-neutral-700 mb-1">Wants:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted.slice(0, 3).map((skill, index) => (
                      <span key={index} className="badge badge-secondary text-xs">
                        {skill.name}
                      </span>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <span className="text-xs text-neutral-400">
                        +{user.skillsWanted.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-neutral-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{getAvailabilityText(user)}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={`/user/${user._id}`}
                  className="btn btn-primary"
                >
                  View Profile
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Browse;