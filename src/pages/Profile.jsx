import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Mail, User, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-800 dark:to-zinc-600 relative">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-14 pb-8 px-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">NEXORA Member</p>

            {/* Info Grid */}
            <div className="mt-8 space-y-4">
              {/* Email */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Role</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {user?.role || 'Customer'}
                  </p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mt-8 w-full flex items-center justify-center space-x-2 py-3 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
