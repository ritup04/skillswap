import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Clock, 
  Star, 
  Send,
  ArrowLeft
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapData, setSwapData] = useState({
    requestedSkill: { name: '', description: '' },
    offeredSkill: { name: '', description: '' },
    message: '',
    scheduledDate: ''
  });

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user profile');
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSwapRequest = async () => {
    try {
      await axios.post('/api/swaps', {
        recipientId: user._id,
        ...swapData
      });
      toast.success('Swap request sent successfully!');
      setShowSwapModal(false);
      setSwapData({
        requestedSkill: { name: '', description: '' },
        offeredSkill: { name: '', description: '' },
        message: '',
        scheduledDate: ''
      });
    } catch (error) {
      console.error('Error sending swap request:', error);
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getAvailabilityText = (availability) => {
    const options = [];
    
    if (availability.weekdays) options.push('Weekdays');
    if (availability.weekends) options.push('Weekends');
    if (availability.evenings) options.push('Evenings');
    if (availability.mornings) options.push('Mornings');
    
    return options.length > 0 ? options.join(', ') : 'Not specified';
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="main-card mt-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-semibold text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              {user.location && (
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </p>
              )}
              {user.rating && typeof user.rating.average === 'number' && user.rating.count > 0 && (
                <div className="flex items-center mt-2">
                  <div className="flex items-center mr-2">
                    {renderStars(user.rating && typeof user.rating.average === 'number' ? user.rating.average : 5.0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({user.rating && typeof user.rating.count === 'number' ? user.rating.count : 0} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {currentUser && currentUser._id !== user._id && (
            <button
              onClick={() => setShowSwapModal(true)}
              className="btn btn-primary"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Swap
            </button>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
          <p className="text-gray-700">{user.bio}</p>
        </div>
      )}

      {/* Availability */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Availability</h2>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{getAvailabilityText(user.availability || {})}</span>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Offered</h2>
        {user.skillsOffered.length === 0 ? (
          <p className="text-gray-500">No skills offered yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {user.skillsOffered.map((skill, index) => (
              <div key={skill._id || index} className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">{skill.name}</h3>
                {skill.description && (
                  <p className="text-sm text-green-600 mt-1">{skill.description}</p>
                )}
                <span className="badge badge-primary text-xs mt-2">{skill.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Wanted */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Wanted</h2>
        {user.skillsWanted.length === 0 ? (
          <p className="text-gray-500">No skills wanted yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {user.skillsWanted.map((skill, index) => (
              <div key={skill._id || index} className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">{skill.name}</h3>
                {skill.description && (
                  <p className="text-sm text-blue-600 mt-1">{skill.description}</p>
                )}
                <span className="badge badge-secondary text-xs mt-2">{skill.priority} Priority</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Request Skill Swap</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill You Want to Learn
                </label>
                <input
                  type="text"
                  value={swapData.requestedSkill.name}
                  onChange={(e) => setSwapData({
                    ...swapData,
                    requestedSkill: { ...swapData.requestedSkill, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Guitar"
                />
                <textarea
                  value={swapData.requestedSkill.description}
                  onChange={(e) => setSwapData({
                    ...swapData,
                    requestedSkill: { ...swapData.requestedSkill, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Describe what you want to learn..."
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill You Can Offer
                </label>
                <input
                  type="text"
                  value={swapData.offeredSkill.name}
                  onChange={(e) => setSwapData({
                    ...swapData,
                    offeredSkill: { ...swapData.offeredSkill, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Spanish"
                />
                <textarea
                  value={swapData.offeredSkill.description}
                  onChange={(e) => setSwapData({
                    ...swapData,
                    offeredSkill: { ...swapData.offeredSkill, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Describe what you can teach..."
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={swapData.message}
                  onChange={(e) => setSwapData({ ...swapData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a personal message..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={swapData.scheduledDate}
                  onChange={(e) => setSwapData({ ...swapData, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSwapRequest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;