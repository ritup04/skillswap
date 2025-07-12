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
  Home
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
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
    <nav className="bg-light-card dark:bg-dark-card rounded-3xl shadow-card px-8 py-4 mt-6 mb-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <Users className="w-8 h-8 text-light-primary dark:text-dark-primary" />
        <span className="text-2xl font-extrabold text-light-primary dark:text-dark-primary tracking-tight">SkillSwap</span>
      </div>
      <div className="flex items-center space-x-8 text-lg font-medium">
        <Link to="/" className="flex items-center gap-1 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"><Home className="w-5 h-5" />Home</Link>
        <Link to="/browse" className="flex items-center gap-1 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"><Search className="w-5 h-5" />Browse</Link>
        {isAuthenticated ? (
          <>
            <Link to="/swaps" className="flex items-center gap-1 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"><Users className="w-5 h-5" />My Swaps</Link>
            <Link to="/profile" className="flex items-center gap-1 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"><User className="w-5 h-5" />Profile</Link>
            <button onClick={handleLogout} className="flex items-center gap-1 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"><LogOut className="w-5 h-5" />Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="flex items-center gap-1 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors"><LogIn className="w-5 h-5" />Login</Link>
            <Link to="/register" className="btn btn-primary rounded-full px-6 py-2">Sign Up</Link>
          </>
        )}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="ml-4 p-2 rounded-full bg-light-bg dark:bg-dark-bg border border-light-muted dark:border-dark-muted text-light-primary dark:text-dark-primary hover:bg-light-muted dark:hover:bg-dark-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;