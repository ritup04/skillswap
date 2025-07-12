import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
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
import { useAuth } from '../contexts/AuthContext';

const Swaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user: currentUser } = useAuth();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingSwap, setRatingSwap] = useState(null);
  const [ratingData, setRatingData] = useState({ rating: 5, comment: '' });
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchSwaps = useCallback(async () => {
    try {
      setLoading(true);
      const params = activeTab !== 'all' ? '?status=' + activeTab : '';
      const response = await api.get('/swaps/my-swaps' + params);
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
      await api.put('/swaps/' + swapId + '/accept');
      toast.success('Swap request accepted!');
      fetchSwaps();
    } catch (error) {
      console.error('Error accepting swap:', error);
      toast.error('Failed to accept swap request');
    }
  }, [fetchSwaps]);

  const handleReject = useCallback(async (swapId) => {
    try {
      await api.put('/swaps/' + swapId + '/reject');
      toast.success('Swap request rejected');
      fetchSwaps();
    } catch (error) {
      console.error('Error rejecting swap:', error);
      toast.error('Failed to reject swap request');
    }
  }, [fetchSwaps]);

  const handleComplete = useCallback(async (swapId) => {
    try {
      await api.put('/swaps/' + swapId + '/complete');
      toast.success('Swap marked as completed!');
      fetchSwaps();
    } catch (error) {
      console.error('Error completing swap:', error);
      toast.error('Failed to complete swap');
    }
  }, [fetchSwaps]);

  const handleCancel = useCallback(async (swapId) => {
    try {
      await api.put('/swaps/' + swapId + '/cancel');
      toast.success('Swap request cancelled');
      fetchSwaps();
    } catch (error) {
      console.error('Error cancelling swap:', error);
      toast.error('Failed to cancel swap request');
    }
  }, [fetchSwaps]);

  const openRatingModal = (swap) => {
    setRatingSwap(swap);
    setRatingData({ rating: 5, comment: '' });
    setShowRatingModal(true);
  };
  const closeRatingModal = () => {
    setShowRatingModal(false);
    setRatingSwap(null);
  };
  const handleSubmitRating = async () => {
    setRatingLoading(true);
    try {
      await api.post(`/swaps/${ratingSwap._id}/rate`, ratingData);
      toast.success('Rating submitted successfully!');
      closeRatingModal();
      fetchSwaps();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

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
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-16 px-2">
      <div className="w-full max-w-6xl flex flex-col items-start mb-8 mt-4">
        <h1 className="text-4xl font-bold text-[#0C0420] mb-2">My Swap Requests</h1>
        <p className="text-lg text-[#5D3C64]">Manage your skill exchange requests</p>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-6xl flex space-x-1 bg-[#F5F0F7] p-1 rounded-lg mb-10">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-6 rounded-lg text-md font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-[#7B466A] shadow'
                : 'text-[#7B466A] hover:text-[#0C0420]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Swaps List */}
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {swaps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#5D3C64] text-xl font-semibold mb-2">No swaps found</p>
            <p className="text-[#9F6496] mb-4">
              {activeTab === 'all' 
                ? "You haven't made any swap requests yet"
                : `No ${activeTab} swaps found`
              }
            </p>
            {activeTab === 'all' && (
              <Link to="/browse" className="px-6 py-3 rounded-lg bg-[#7B466A] text-white font-bold shadow hover:bg-[#5D3C64] transition-colors text-lg inline-flex items-center">
                Browse Skills
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            )}
          </div>
        ) : (
          swaps.map((swap) => (
            <div key={swap._id} className="w-full bg-white/80 rounded-2xl shadow-lg border-2 border-[#D391B0] p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-shadow mx-auto">
              {/* Left: User avatars and info */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#7B466A] flex items-center justify-center text-4xl text-white font-bold shadow-lg border-4 border-[#7B466A]">
                  <User className="w-12 h-12" />
                </div>
                <div className="mt-2 text-[#0C0420] font-semibold text-lg">
                  {swap.requester._id === currentUser._id ? 'You' : swap.requester.name}
                </div>
                <div className="text-[#9F6496] text-xs">Requester</div>
              </div>
              {/* Center: Swap details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[#7B466A] font-bold text-lg">{swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}</span>
                  {getStatusBadge(swap.status)}
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                  <div>
                    <span className="text-sm font-semibold text-green-700">You're offering:</span>
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                      {swap.offeredSkill.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-blue-700">You're requesting:</span>
                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                      {swap.requestedSkill.name}
                    </span>
                  </div>
                </div>
                {swap.message && (
                  <div className="mt-4 p-3 bg-[#F5F0F7] rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-[#9F6496] mt-0.5" />
                      <p className="text-sm text-[#7B466A]">{swap.message}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-6 mt-4 text-sm text-[#5D3C64]">
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
              {/* Right: Action Buttons */}
              <div className="flex flex-col gap-2 items-end min-w-[160px]">
                <Link
                  to={`/swaps/${swap._id}`}
                  className="px-5 py-2 rounded-lg bg-[#D391B0] text-[#0C0420] font-bold shadow hover:bg-[#BA6E8F] transition-colors text-md"
                >
                  View Details
                </Link>
                {swap.status === 'pending' && (
                  <>
                    {swap.recipient._id === currentUser._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(swap._id)}
                          className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-colors text-md"
                        >
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </button>
                        <button
                          onClick={() => handleReject(swap._id)}
                          className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold shadow hover:bg-red-700 transition-colors text-md"
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCancel(swap._id)}
                        className="px-5 py-2 rounded-lg bg-red-600 text-white font-bold shadow hover:bg-red-700 transition-colors text-md"
                      >
                        <X className="w-4 h-4 mr-1" /> Withdraw
                      </button>
                    )}
                  </>
                )}
                {swap.status === 'accepted' && (
                  <button
                    onClick={() => handleComplete(swap._id)}
                    className="px-5 py-2 rounded-lg bg-[#7B466A] text-white font-bold shadow hover:bg-[#5D3C64] transition-colors text-md"
                  >
                    Mark as Completed
                  </button>
                )}
                {swap.status === 'completed' && !swap.requesterRating?.rating && (
                  <button
                    onClick={() => openRatingModal(swap)}
                    className="px-5 py-2 rounded-lg bg-[#7B466A] text-white font-bold shadow hover:bg-[#5D3C64] transition-colors text-md"
                  >
                    Leave Rating
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && ratingSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-bold text-purple-700 mb-4">Rate Your Swap</h2>
            <form
              onSubmit={e => { e.preventDefault(); handleSubmitRating(); }}
              className="space-y-4"
            >
              <div>
                <label className="block text-purple-800 font-semibold mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${ratingData.rating >= star ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'}`}
                      onClick={() => setRatingData({ ...ratingData, rating: star })}
                      tabIndex={-1}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-purple-800 font-semibold mb-1">Comment (optional)</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none bg-white/80"
                  value={ratingData.comment}
                  onChange={e => setRatingData({ ...ratingData, comment: e.target.value })}
                  rows={2}
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-purple-600 hover:to-indigo-600 transition-colors disabled:opacity-60"
                  disabled={ratingLoading}
                >
                  {ratingLoading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="bg-white/80 text-purple-700 font-bold px-6 py-2 rounded-lg border border-purple-200 shadow hover:bg-purple-100 transition-colors"
                  onClick={closeRatingModal}
                  disabled={ratingLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swaps;