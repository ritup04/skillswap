import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit, X, MapPin, Clock, Star, User, LogOut } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const sidebarLinks = [
  { label: 'Profile', icon: <User className="w-5 h-5" /> },
  { label: 'My Skills', icon: <Star className="w-5 h-5" /> },
  { label: 'Availability', icon: <Clock className="w-5 h-5" /> },
  { label: 'Settings', icon: <Edit className="w-5 h-5" /> },
  { label: 'Logout', icon: <LogOut className="w-5 h-5" /> },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    bio: user?.bio || '',
    isPublic: user?.isPublic ?? true,
    availability: user?.availability || {
      weekdays: false,
      weekends: false,
      evenings: false,
      mornings: false,
      customSchedule: ''
    }
  });

  const [newSkillOffered, setNewSkillOffered] = useState({ name: '', description: '', proficiency: 'Intermediate' });
  const [newSkillWanted, setNewSkillWanted] = useState({ name: '', description: '', priority: 'Medium' });
  const [showAddSkillOffered, setShowAddSkillOffered] = useState(false);
  const [showAddSkillWanted, setShowAddSkillWanted] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        location: user.location || '',
        bio: user.bio || '',
        isPublic: user.isPublic ?? true,
        availability: user.availability || {
          weekdays: false,
          weekends: false,
          evenings: false,
          mornings: false,
          customSchedule: ''
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put('/api/users/profile', profileData);
      updateUser(response.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkillOffered = async () => {
    try {
      const response = await axios.post('/api/users/skills-offered', newSkillOffered);
      updateUser({ ...user, skillsOffered: response.data });
      setNewSkillOffered({ name: '', description: '', proficiency: 'Intermediate' });
      setShowAddSkillOffered(false);
      toast.success('Skill added successfully!');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error(error.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleAddSkillWanted = async () => {
    try {
      const response = await axios.post('/api/users/skills-wanted', newSkillWanted);
      updateUser({ ...user, skillsWanted: response.data });
      setNewSkillWanted({ name: '', description: '', priority: 'Medium' });
      setShowAddSkillWanted(false);
      toast.success('Skill added successfully!');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error(error.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkillOffered = async (skillId) => {
    try {
      const response = await axios.delete(`/api/users/skills-offered/${skillId}`);
      updateUser({ ...user, skillsOffered: response.data });
      toast.success('Skill removed successfully!');
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const handleRemoveSkillWanted = async (skillId) => {
    try {
      const response = await axios.delete(`/api/users/skills-wanted/${skillId}`);
      updateUser({ ...user, skillsWanted: response.data });
      toast.success('Skill removed successfully!');
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
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

  if (!user) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-indigo-100 to-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-purple-600 to-indigo-600 text-white py-8 px-6 rounded-tr-3xl rounded-br-3xl shadow-xl mr-8">
        <div className="flex flex-col items-center mb-10">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mb-3" />
          ) : (
            <div className="w-20 h-20 bg-purple-300 rounded-full flex items-center justify-center mb-3">
              <span className="text-white font-bold text-3xl">{user.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="text-lg font-semibold mt-2">{user.name}</div>
          <div className="text-purple-200 text-xs">{user.email}</div>
        </div>
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link, idx) => (
            <button key={link.label} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${idx === 0 ? 'bg-white/20 text-white font-bold' : 'hover:bg-white/10 text-purple-100'}`}>{link.icon}<span>{link.label}</span></button>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-center pt-8">
          <img src="/logo192.png" alt="Logo" className="w-16 h-16" />
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-8 py-10 px-2 md:px-0">
        {/* Profile Info Card */}
        <div className="w-full max-w-3xl mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-100 p-8 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
          <div className="flex-shrink-0">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-purple-200 shadow-md" />
            ) : (
              <div className="w-28 h-28 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-4xl">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-purple-800 mb-1">{user.name}</h2>
            <div className="text-purple-500 mb-2">{user.location}</div>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(user.rating.average)}
              <span className="text-sm text-purple-400">({user.rating.count} reviews)</span>
            </div>
            <div className="text-sm text-purple-700 mb-2">{user.bio}</div>
            <div className="flex items-center gap-4 text-xs text-purple-400">
              <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              <span>|</span>
              <span>Public Profile: {user.isPublic ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="ml-auto btn btn-secondary bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-lg flex items-center gap-2">
            {editing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {/* Skills/Timeline Card */}
        <div className="w-full max-w-3xl mx-auto bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-100 p-8 animate-fade-in">
          <h3 className="text-xl font-bold text-purple-800 mb-6">My Skills</h3>
          <div className="space-y-4">
            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              user.skillsOffered.map((skill, idx) => (
                <div key={skill._id || idx} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400" />
                  <div className="flex-1">
                    <div className="font-semibold text-purple-700">{skill.name}</div>
                    <div className="text-xs text-purple-400">{skill.description}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">{skill.proficiency}</span>
                </div>
              ))
            ) : (
              <div className="text-purple-400">No skills offered yet.</div>
            )}
          </div>
        </div>
      </main>
      {/* Right Side Card */}
      <aside className="hidden lg:flex flex-col w-80 ml-8 gap-8 py-10">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-100 p-6 animate-fade-in">
          <h4 className="text-lg font-bold text-purple-800 mb-4">Account Details</h4>
          <div className="text-sm text-purple-700 mb-2">Email: {user.email}</div>
          <div className="text-sm text-purple-700 mb-2">Location: {user.location}</div>
          <div className="text-sm text-purple-700 mb-2">Public: {user.isPublic ? 'Yes' : 'No'}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-indigo-400 rounded-2xl shadow-lg p-6 text-white animate-fade-in">
          <h4 className="text-lg font-bold mb-2">SkillSwap Premium</h4>
          <ul className="text-sm mb-4 list-disc list-inside opacity-90">
            <li>Priority swap requests</li>
            <li>Premium badge on profile</li>
            <li>Early access to new features</li>
          </ul>
          <button className="w-full py-2 rounded-lg bg-white/80 text-purple-700 font-bold hover:bg-white transition-colors">Subscribe</button>
        </div>
      </aside>
    </div>
  );
};

export default Profile;