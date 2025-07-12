import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Edit, 
  X, 
  Plus, 
  MapPin, 
  Clock, 
  Star
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

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
    <div className="main-card mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">My Profile</h1>
        <p className="text-neutral-500">Manage your profile, skills, and availability</p>
      </div>

      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-semibold text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              {user.location && (
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </p>
              )}
              {user.rating.count > 0 && (
                <div className="flex items-center mt-1">
                  <div className="flex items-center mr-2">
                    {renderStars(user.rating.average)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({user.rating.count} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-secondary"
          >
            {editing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Profile Form */}
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                name="name"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                name="location"
                placeholder="Enter your location"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                rows="3"
                placeholder="Tell others about yourself..."
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={profileData.isPublic}
                onChange={(e) => setProfileData({ ...profileData, isPublic: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make my profile public
              </label>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.availability.weekdays}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      availability: { ...profileData.availability, weekdays: e.target.checked }
                    })}
                    className="mr-2"
                  />
                  Weekdays
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.availability.weekends}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      availability: { ...profileData.availability, weekends: e.target.checked }
                    })}
                    className="mr-2"
                  />
                  Weekends
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.availability.evenings}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      availability: { ...profileData.availability, evenings: e.target.checked }
                    })}
                    className="mr-2"
                  />
                  Evenings
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.availability.mornings}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      availability: { ...profileData.availability, mornings: e.target.checked }
                    })}
                    className="mr-2"
                  />
                  Mornings
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                Available: {
                  Object.entries(user.availability)
                    .filter(([key, value]) => key !== 'customSchedule' && value)
                    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                    .join(', ') || 'Not specified'
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Skills Offered */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Skills I Offer</h3>
          <button
            onClick={() => setShowAddSkillOffered(!showAddSkillOffered)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>

        {showAddSkillOffered && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillOffered.name}
                  onChange={(e) => setNewSkillOffered({ ...newSkillOffered, name: e.target.value })}
                  className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                  placeholder="e.g., JavaScript"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newSkillOffered.description}
                  onChange={(e) => setNewSkillOffered({ ...newSkillOffered, description: e.target.value })}
                  className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                <select
                  value={newSkillOffered.proficiency}
                  onChange={(e) => setNewSkillOffered({ ...newSkillOffered, proficiency: e.target.value })}
                  className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddSkillOffered(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkillOffered}
                disabled={!newSkillOffered.name}
                className="btn btn-primary"
              >
                Add Skill
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {user.skillsOffered.map((skill, index) => (
            <div key={skill._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                {skill.description && <p className="text-sm text-gray-600">{skill.description}</p>}
                <span className="badge badge-primary text-xs">{skill.proficiency}</span>
              </div>
              <button
                onClick={() => handleRemoveSkillOffered(skill._id)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {user.skillsOffered.length === 0 && (
            <p className="text-gray-500 text-center py-4">No skills offered yet</p>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Skills I Want to Learn</h3>
          <button
            onClick={() => setShowAddSkillWanted(!showAddSkillWanted)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>

        {showAddSkillWanted && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkillWanted.name}
                  onChange={(e) => setNewSkillWanted({ ...newSkillWanted, name: e.target.value })}
                  className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                  placeholder="e.g., Photoshop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newSkillWanted.description}
                  onChange={(e) => setNewSkillWanted({ ...newSkillWanted, description: e.target.value })}
                  className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newSkillWanted.priority}
                  onChange={(e) => setNewSkillWanted({ ...newSkillWanted, priority: e.target.value })}
                  className="input bg-beige-50 text-brown-700 placeholder-brown-300"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddSkillWanted(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkillWanted}
                disabled={!newSkillWanted.name}
                className="btn btn-primary"
              >
                Add Skill
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {user.skillsWanted.map((skill, index) => (
            <div key={skill._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                {skill.description && <p className="text-sm text-gray-600">{skill.description}</p>}
                <span className="badge badge-secondary text-xs">{skill.priority} Priority</span>
              </div>
              <button
                onClick={() => handleRemoveSkillWanted(skill._id)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {user.skillsWanted.length === 0 && (
            <p className="text-gray-500 text-center py-4">No skills wanted yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;