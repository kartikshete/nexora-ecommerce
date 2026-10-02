import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Settings, LogOut, ChevronDown } from 'lucide-react';

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const avatarInitial = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
            {avatarInitial}
          </div>
        )}
        <span className="hidden sm:inline max-w-[80px] truncate">{user?.name?.split(' ')[0] || 'Profile'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 py-1.5 z-50 animate-slide-up">
          {/* User info header */}
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-zinc-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => handleNavigation('/profile')}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => handleNavigation('/profile?tab=addresses')}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>My Addresses</span>
            </button>
            <button
              onClick={() => handleNavigation('/profile?tab=settings')}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
