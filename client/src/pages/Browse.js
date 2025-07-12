import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, MapPin, Clock, Filter, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const Browse = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const { user: currentUser } = useAuth();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapTarget, setSwapTarget] = useState(null);
  const [mySkill, setMySkill] = useState('');
  const [theirSkill, setTheirSkill] = useState('');
  const [swapMessage, setSwapMessage] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);
  const USERS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const publicUsers = users.filter(user => user.isPublic);
  const totalPages = Math.ceil(publicUsers.length / USERS_PER_PAGE);
  const paginatedUsers = publicUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

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
    // Listen for refresh-users event
    const handler = () => fetchUsers();
    window.addEventListener('refresh-users', handler);
    return () => window.removeEventListener('refresh-users', handler);
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

  const openSwapModal = (targetUser) => {
    setSwapTarget(targetUser);
    setMySkill('');
    setTheirSkill('');
    setSwapMessage('');
    setShowSwapModal(true);
  };
  const closeSwapModal = () => {
    setShowSwapModal(false);
    setSwapTarget(null);
  };
  const handleSendSwap = async () => {
    if (!mySkill || !theirSkill) {
      toast.error('Please select both skills');
      return;
    }
    setSwapLoading(true);
    try {
      await api.post('/swaps', {
        recipientId: swapTarget._id,
        requestedSkill: { name: theirSkill },
        offeredSkill: { name: mySkill },
        message: swapMessage
      });
      toast.success('Swap request sent!');
      closeSwapModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    } finally {
      setSwapLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-16 px-2">
      <div className="w-full max-w-6xl flex flex-col items-start mb-8 mt-4">
        <h1 className="text-4xl font-bold text-[#0C0420] mb-2">Browse Skills</h1>
        <p className="text-lg text-[#5D3C64]">Find people with the skills you want to learn</p>
      </div>

      {/* Search and Filters */}
      <div className="w-full max-w-6xl mb-10 bg-white/80 rounded-2xl shadow-lg border-2 border-[#9F6496] p-8 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9F6496] w-5 h-5" />
              <input
                type="text"
                placeholder="Search for skills (e.g., Photoshop, JavaScript, Guitar)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-10 py-3 rounded-lg border border-[#7B466A] focus:ring-2 focus:ring-[#D391B0] outline-none bg-white text-[#0C0420] placeholder-[#9F6496] shadow"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#D391B0] text-[#0C0420] font-semibold shadow hover:bg-[#BA6E8F] transition-colors lg:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#7B466A] text-white font-semibold shadow hover:bg-[#5D3C64] transition-colors lg:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-[#D391B0]">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#7B466A] mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9F6496] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-10 py-2 rounded-lg border border-[#7B466A] focus:ring-2 focus:ring-[#D391B0] outline-none bg-white text-[#0C0420] placeholder-[#9F6496] shadow"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#7B466A] mb-1">
                  Availability
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9F6496] w-4 h-4" />
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-10 py-2 rounded-lg border border-[#7B466A] focus:ring-2 focus:ring-[#D391B0] outline-none bg-white text-[#0C0420] shadow"
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
                className="text-sm text-[#7B466A] hover:text-[#0C0420] flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Cards */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        {publicUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 text-lg">No users found</p>
          </div>
        ) : (
          paginatedUsers.map((user) => (
            <div key={user._id} className="w-full bg-white/80 rounded-2xl shadow-lg border-2 border-[#D391B0] p-8 flex flex-row items-center gap-8 hover:shadow-2xl transition-shadow mx-auto relative">
              {/* Left: Profile photo */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#7B466A] shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 bg-[#7B466A] rounded-full flex items-center justify-center text-5xl text-white font-bold shadow-lg border-4 border-[#7B466A]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Center: Info */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-bold text-[#0C0420] whitespace-nowrap">{user.name}</h2>
                  {user.location && (
                    <div className="text-[#5D3C64] flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <div>
                    <span className="text-sm font-semibold text-green-700">Skills Offered:</span>
                    <span className="ml-2 flex flex-wrap gap-2">
                      {user.skillsOffered.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                          {skill.name}
                        </span>
                      ))}
                      {user.skillsOffered.length > 3 && (
                        <span className="text-xs text-green-700">
                          +{user.skillsOffered.length - 3} more
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-blue-700">Skill wanted:</span>
                    <span className="ml-2 flex flex-wrap gap-2">
                      {user.skillsWanted.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                          {skill.name}
                        </span>
                      ))}
                      {user.skillsWanted.length > 3 && (
                        <span className="text-xs text-blue-700">
                          +{user.skillsWanted.length - 3} more
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-[#5D3C64]">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{getAvailabilityText(user)}</span>
                </div>
              </div>
              {/* Right: Request/View Profile button and rating */}
              <div className="flex flex-col items-end justify-between h-full min-w-[160px] gap-4">
                {currentUser && user._id !== currentUser._id && (
                  <button
                    className="px-7 py-3 rounded-lg bg-[#7B466A] text-white font-bold shadow hover:bg-[#5D3C64] transition-colors text-lg"
                    onClick={() => openSwapModal(user)}
                  >
                    Request Swap
                  </button>
                )}
                <div className="text-right text-[#5D3C64] text-sm mt-4">
                  rating <span className="font-bold text-[#0C0420]">{user.rating?.average ? user.rating.average.toFixed(1) + '/5' : 'not yet rated'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Swap Modal */}
      {showSwapModal && swapTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-bold text-[#7B466A] mb-4">Request Swap with {swapTarget.name}</h2>
            <form
              onSubmit={e => { e.preventDefault(); handleSendSwap(); }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#7B466A] font-semibold mb-1">Choose one of your offered skills</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-[#D391B0] focus:ring-2 focus:ring-[#D391B0] outline-none bg-white/80"
                  value={mySkill}
                  onChange={e => setMySkill(e.target.value)}
                  required
                >
                  <option value="">Select a skill</option>
                  {currentUser?.skillsOffered?.map(skill => (
                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#9F6496] font-semibold mb-1">Choose one of their offered skills</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-[#D391B0] focus:ring-2 focus:ring-[#D391B0] outline-none bg-white/80"
                  value={theirSkill}
                  onChange={e => setTheirSkill(e.target.value)}
                  required
                >
                  <option value="">Select a skill</option>
                  {swapTarget.skillsOffered?.map(skill => (
                    <option key={skill.name} value={skill.name}>{skill.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#7B466A] font-semibold mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-[#D391B0] focus:ring-2 focus:ring-[#D391B0] outline-none bg-white/80"
                  value={swapMessage}
                  onChange={e => setSwapMessage(e.target.value)}
                  rows={3}
                  placeholder="Add a message..."
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-[#7B466A] text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-[#5D3C64] transition-colors disabled:opacity-60"
                  disabled={swapLoading}
                >
                  {swapLoading ? 'Sending...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="bg-white/80 text-[#7B466A] font-bold px-6 py-2 rounded-lg border border-[#D391B0] shadow hover:bg-[#D391B0]/30 transition-colors"
                  onClick={closeSwapModal}
                  disabled={swapLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="w-full max-w-6xl flex justify-center mt-8">
          <nav className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-[#D391B0] text-white font-bold"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded border border-[#D391B0] text-[#7B466A] font-bold hover:bg-[#D391B0] hover:text-white transition-colors ${page === currentPage ? 'bg-[#D391B0] text-white' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-[#D391B0] text-white font-bold"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Browse;