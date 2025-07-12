import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Clock, 
  Check, 
  X, 
  Star, 
  MessageSquare,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Swaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchSwaps = useCallback(async () => {
    try {
      setLoading(true);
      const params = activeTab !== 'all' ? '?status=' + activeTab : '';
      const response = await axios.get('/api/swaps/my-swaps' + params);
      setSwaps(response.data);
    } catch (error) {
      console.error('Error fetching swaps:', error);
      toast.error('Failed to load swaps');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps]);

  const handleAccept = useCallback(async (swapId) => {
    try {
      await axios.put('/api/swaps/' + swapId + '/accept');
      toast.success('Swap request accepted!');
      fetchSwaps();
    } catch (error) {
      console.error('Error accepting swap:', error);
      toast.error('Failed to accept swap request');
    }
  }, [fetchSwaps]);

  const handleReject = useCallback(async (swapId) => {
    try {
      await axios.put('/api/swaps/' + swapId + '/reject');
      toast.success('Swap request rejected');
      fetchSwaps();
    } catch (error) {
      console.error('Error rejecting swap:', error);
      toast.error('Failed to reject swap request');
    }
  }, [fetchSwaps]);

  const handleComplete = useCallback(async (swapId) => {
    try {
      await axios.put('/api/swaps/' + swapId + '/complete');
      toast.success('Swap marked as completed!');
      fetchSwaps();
    } catch (error) {
      console.error('Error completing swap:', error);
      toast.error('Failed to complete swap');
    }
  }, [fetchSwaps]);

  const handleCancel = useCallback(async (swapId) => {
    try {
      await axios.put('/api/swaps/' + swapId + '/cancel');
      toast.success('Swap request cancelled');
      fetchSwaps();
    } catch (error) {
      console.error('Error cancelling swap:', error);
      toast.error('Failed to cancel swap request');
    }
  }, [fetchSwaps]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'badge-warning', text: 'Pending' },
      accepted: { color: 'badge-success', text: 'Accepted' },
      rejected: { color: 'badge-danger', text: 'Rejected' },
      completed: { color: 'badge-primary', text: 'Completed' },
      cancelled: { color: 'badge-secondary', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { color: 'badge-secondary', text: status };
    return <span className={`badge ${config.color}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="main-card mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">My Swaps</h1>
        <p className="text-neutral-500">Manage your skill exchange requests</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Swaps List */}
      <div className="space-y-6">
        {swaps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No swaps found</p>
            <p className="text-gray-400 mt-2">
              {activeTab === 'all' 
                ? "You haven't made any swap requests yet"
                : `No ${activeTab} swaps found`
              }
            </p>
            {activeTab === 'all' && (
              <Link to="/browse" className="btn btn-primary mt-4">
                Browse Skills
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        ) : (
          swaps.map((swap) => (
            <div key={swap._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {swap.requester._id === swap.recipient._id ? 'You' : 'You'} 
                        {swap.requester._id === swap.recipient._id ? ' requested from ' : ' requested from '}
                        {swap.recipient.name}
                      </span>
                    </div>
                    {getStatusBadge(swap.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">You're offering:</h3>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-medium text-green-800">{swap.offeredSkill.name}</p>
                        {swap.offeredSkill.description && (
                          <p className="text-sm text-green-600 mt-1">{swap.offeredSkill.description}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">You're requesting:</h3>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-800">{swap.requestedSkill.name}</p>
                        {swap.requestedSkill.description && (
                          <p className="text-sm text-blue-600 mt-1">{swap.requestedSkill.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {swap.message && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-700">{swap.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {formatDate(swap.createdAt)}
                    </div>
                    {swap.scheduledDate && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Scheduled {formatDate(swap.scheduledDate)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Link
                    to={`/swaps/${swap._id}`}
                    className="btn btn-secondary text-sm"
                  >
                    View Details
                  </Link>

                  {swap.status === 'pending' && (
                    <>
                      {swap.requester._id !== swap.recipient._id ? (
                        // Recipient actions
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAccept(swap._id)}
                            className="btn btn-success text-sm"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(swap._id)}
                            className="btn btn-danger text-sm"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        // Requester actions
                        <button
                          onClick={() => handleCancel(swap._id)}
                          className="btn btn-danger text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </>
                  )}

                  {swap.status === 'accepted' && (
                    <button
                      onClick={() => handleComplete(swap._id)}
                      className="btn btn-primary text-sm"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Mark Complete
                    </button>
                  )}

                  {swap.status === 'completed' && (
                    <div className="text-center">
                      <div className="flex items-center justify-center text-yellow-500 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium ml-1">Rate this swap</span>
                      </div>
                      <Link
                        to={`/swaps/${swap._id}`}
                        className="text-sm text-primary-600 hover:text-primary-500"
                      >
                        Add review
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Swaps;