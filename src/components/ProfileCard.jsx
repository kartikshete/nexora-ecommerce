import React, { useState } from 'react';
import { Edit2, Save, X, Mail, Phone, Calendar, User, Camera } from 'lucide-react';

const ProfileCard = ({ user, onSave, loading = false }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = () => {
    onSave(formData);
    setEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const avatarInitial = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
      {/* Header Banner */}
      <div className="h-24 bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-800 dark:to-zinc-600 relative">
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{avatarInitial}</span>
            )}
          </div>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="absolute top-4 right-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="pt-14 pb-6 px-6">
        {editing ? (
          /* ── Edit Mode ── */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Avatar URL</label>
              <div className="relative">
                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email (cannot be changed)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800/50 text-gray-400 dark:text-gray-500 text-sm cursor-not-allowed"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white dark:border-zinc-900 border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ── Display Mode ── */
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">NEXORA Member</p>

            <div className="mt-6 space-y-3">
              {/* Email */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.phone || 'Not set'}</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
