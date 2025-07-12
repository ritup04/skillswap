import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch all users for skill moderation
  useEffect(() => {
    if (activeTab === 'skills') {
      setLoading(true);
      setError('');
      api.get('/users/all')
        .then(res => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch users:', err);
          setError('Failed to fetch users. Please check your admin permissions.');
          setLoading(false);
        });
    }
  }, [activeTab]);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Remove a skill (offered or wanted)
  const handleRejectSkill = async (userId, skillId, type) => {
    setError('');
    setSuccess('');
    try {
      await api.delete(`/users/${type === 'offered' ? 'skills-offered' : 'skills-wanted'}/${skillId}`);
      setSuccess('Skill rejected successfully.');
      // Refresh users
      setUsers(users => users.map(u => {
        if (u._id !== userId) return u;
        return {
          ...u,
          skillsOffered: type === 'offered' ? u.skillsOffered.filter(s => s._id !== skillId) : u.skillsOffered,
          skillsWanted: type === 'wanted' ? u.skillsWanted.filter(s => s._id !== skillId) : u.skillsWanted,
        };
      }));
    } catch (err) {
      console.error('Failed to reject skill:', err);
      setError('Failed to reject skill. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full bg-[#5D3C64] text-white py-6 px-8 flex items-center justify-between shadow">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          className="bg-white text-[#5D3C64] px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100"
          onClick={() => navigate('/')}
        >
          Back to Main
        </button>
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 gap-2">
          <button className={`text-left px-4 py-3 rounded-lg font-semibold ${activeTab === 'skills' ? 'bg-[#D391B0] text-[#0C0420]' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('skills')}>Skill Moderation</button>
          <button className={`text-left px-4 py-3 rounded-lg font-semibold ${activeTab === 'users' ? 'bg-[#D391B0] text-[#0C0420]' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('users')}>User Management</button>
          <button className={`text-left px-4 py-3 rounded-lg font-semibold ${activeTab === 'swaps' ? 'bg-[#D391B0] text-[#0C0420]' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('swaps')}>Swap Monitoring</button>
          <button className={`text-left px-4 py-3 rounded-lg font-semibold ${activeTab === 'messages' ? 'bg-[#D391B0] text-[#0C0420]' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('messages')}>Platform Messages</button>
          <button className={`text-left px-4 py-3 rounded-lg font-semibold ${activeTab === 'reports' ? 'bg-[#D391B0] text-[#0C0420]' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('reports')}>Reports</button>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-10">
          {activeTab === 'skills' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Skill Moderation</h2>
              <p className="mb-4">Review and reject inappropriate or spammy skill descriptions here.</p>
              {loading ? <LoadingSpinner /> : (
                <>
                  {error && <div className="text-red-600 mb-2">{error}</div>}
                  {success && <div className="text-green-600 mb-2">{success}</div>}
                  <div className="space-y-6">
                    {users.length === 0 && <div>No users found.</div>}
                    {users.filter(user => user._id !== 'admin').map(user => (
                      <div key={user._id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-4 mb-2">
                          <img src={user.profilePhoto || '/default-avatar.png'} alt="avatar" className="w-14 h-14 rounded-full object-cover border" />
                          <div>
                            <div className="font-semibold text-lg">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.location}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="w-full font-semibold text-[#5D3C64]">Skills Offered:</div>
                          {user.skillsOffered && user.skillsOffered.length > 0 ? user.skillsOffered.map(skill => (
                            <div key={skill._id} className="flex items-center bg-[#F3E8F7] rounded px-3 py-1 mr-2 mb-2">
                              <span className="mr-2 font-medium">{skill.name}</span>
                              <button className="text-xs text-red-600 hover:underline" onClick={() => handleRejectSkill(user._id, skill._id, 'offered')}>Reject</button>
                            </div>
                          )) : <span className="text-gray-400 ml-2">None</span>}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="w-full font-semibold text-[#5D3C64]">Skills Wanted:</div>
                          {user.skillsWanted && user.skillsWanted.length > 0 ? user.skillsWanted.map(skill => (
                            <div key={skill._id} className="flex items-center bg-[#E3F6F5] rounded px-3 py-1 mr-2 mb-2">
                              <span className="mr-2 font-medium">{skill.name}</span>
                              <button className="text-xs text-red-600 hover:underline" onClick={() => handleRejectSkill(user._id, skill._id, 'wanted')}>Reject</button>
                            </div>
                          )) : <span className="text-gray-400 ml-2">None</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'users' && <div><h2 className="text-2xl font-bold mb-4">User Management</h2><p>Ban users, view user details, and manage user accounts here.</p></div>}
          {activeTab === 'swaps' && <div><h2 className="text-2xl font-bold mb-4">Swap Monitoring</h2><p>Monitor all swaps (pending, accepted, cancelled) here.</p></div>}
          {activeTab === 'messages' && <div><h2 className="text-2xl font-bold mb-4">Platform Messages</h2><p>Send platform-wide messages and alerts here.</p></div>}
          {activeTab === 'reports' && <div><h2 className="text-2xl font-bold mb-4">Reports</h2><p>Download user activity, feedback logs, and swap stats here.</p></div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 