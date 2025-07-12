import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Search, 
  LogOut, 
  Users,
  Moon,
  Sun,
  LogIn,
  Home,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm px-0 py-0 border-t-4 border-[#9F6496]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-extrabold text-[#9F6496] tracking-tight">SkillSwap</span>
        </div>
        {/* Centered Nav Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-10 text-[#0C0420] text-lg font-medium">
            <Link to="/" className="hover:text-[#9F6496] transition-colors">Home</Link>
            <Link to="/browse" className="hover:text-[#9F6496] transition-colors">Browse</Link>
            <Link to="/swaps" className="hover:text-[#9F6496] transition-colors">My Swap Requests</Link>
          </div>
        </div>
        {/* Right: Login or Profile */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <Link to="/profile" className="ml-4">
              {user && user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-[#9F6496] shadow" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#9F6496] flex items-center justify-center text-white font-bold text-xl">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login" className="ml-4 px-5 py-2 rounded-lg border border-[#9F6496] text-[#5D3C64] font-semibold hover:bg-[#9F6496] hover:text-white transition-colors">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;