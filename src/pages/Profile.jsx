import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../hooks/useShop';
import ProfileCard from '../components/ProfileCard';
import AddressCard from '../components/AddressCard';
import AddressForm from '../components/AddressForm';
import ConfirmModal from '../components/ConfirmModal';
import * as userService from '../services/userService';
import {
  MapPin,
  Plus,
  Lock,
  Bell,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  User,
  Settings,
  ChevronRight,
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useShop();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Tabs ──
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  const activeTab = searchParams.get('tab') || 'profile';
  const setActiveTab = (tab) => setSearchParams({ tab });

  // ── Profile State ──
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Address State ──
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);

  // ── Password State ──
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // ── Notifications ──
  const [notifications, setNotifications] = useState(
    user?.notificationPreferences || { email: true, orders: true, promotions: false }
  );

  // ── Delete Account ──
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync addresses from user
  useEffect(() => {
    if (user?.addresses) setAddresses(user.addresses);
  }, [user?.addresses]);

  useEffect(() => {
    if (user?.notificationPreferences) setNotifications(user.notificationPreferences);
  }, [user?.notificationPreferences]);

  // ── Profile Handlers ──
  const handleProfileSave = async (data) => {
    setProfileLoading(true);
    try {
      const res = await userService.updateProfile(data);
      updateUser(res.data.user);
      showToast('Profile updated successfully.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Address Handlers ──
  const fetchAddresses = async () => {
    try {
      const res = await userService.getAddresses();
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  const handleAddAddress = async (data) => {
    setAddressLoading(true);
    try {
      const res = await userService.addAddress(data);
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      setAddressFormOpen(false);
      showToast('Address added successfully.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add address.', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = async (data) => {
    if (!editingAddress) return;
    setAddressLoading(true);
    try {
      const res = await userService.updateAddress(editingAddress._id, data);
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      setEditingAddress(null);
      setAddressFormOpen(false);
      showToast('Address updated successfully.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update address.', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!deleteAddressId) return;
    try {
      const res = await userService.deleteAddress(deleteAddressId);
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      setDeleteAddressId(null);
      showToast('Address deleted successfully.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete address.', 'error');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await userService.setDefaultAddress(id);
      setAddresses(res.data.addresses);
      updateUser({ ...user, addresses: res.data.addresses });
      showToast('Default address updated.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to set default.', 'error');
    }
  };

  // ── Password Handlers ──
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.changePassword(passwordForm);
      setPasswordSuccess('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      showToast('Password changed successfully.');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Notification Handlers ──
  const handleNotificationToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      await userService.updateNotifications(updated);
      showToast('Notification preferences updated.');
    } catch (err) {
      setNotifications(notifications); // revert
      showToast('Failed to update preferences.', 'error');
    }
  };

  // ── Delete Account ──
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await userService.deleteAccount(deletePassword);
      logout();
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete account.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white text-sm';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Account</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white dark:bg-zinc-900 rounded-xl p-1 border border-gray-200 dark:border-zinc-800 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══ Profile Tab ═══ */}
        {activeTab === 'profile' && (
          <ProfileCard user={user} onSave={handleProfileSave} loading={profileLoading} />
        )}

        {/* ═══ Addresses Tab ═══ */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>My Addresses</span>
              </h2>
              <button
                onClick={() => { setEditingAddress(null); setAddressFormOpen(true); }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-gray-100 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No addresses saved yet.</p>
                <button
                  onClick={() => { setEditingAddress(null); setAddressFormOpen(true); }}
                  className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white hover:underline"
                >
                  + Add your first address
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    onEdit={(a) => { setEditingAddress(a); setAddressFormOpen(true); }}
                    onDelete={(id) => setDeleteAddressId(id)}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            )}

            {/* Address Form Modal */}
            <AddressForm
              isOpen={addressFormOpen}
              onClose={() => { setAddressFormOpen(false); setEditingAddress(null); }}
              onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
              address={editingAddress}
              loading={addressLoading}
            />

            {/* Delete Address Confirm */}
            <ConfirmModal
              isOpen={!!deleteAddressId}
              onClose={() => setDeleteAddressId(null)}
              onConfirm={handleDeleteAddress}
              title="Delete Address"
              message="This address will be permanently removed."
              confirmText="Delete"
            />
          </div>
        )}

        {/* ═══ Settings Tab ═══ */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* ── Change Password ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </h3>

              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm">
                  {passwordSuccess}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className={inputClass}
                      placeholder="Enter current password"
                    />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className={inputClass}
                      placeholder="Minimum 8 characters"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                    className={inputClass}
                    placeholder="Re-enter new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* ── Notification Preferences ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
                <Bell className="w-4 h-4" />
                <span>Notification Preferences</span>
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive account updates via email' },
                  { key: 'orders', label: 'Order Updates', desc: 'Get notified about order status changes' },
                  { key: 'promotions', label: 'Promotions & Deals', desc: 'Receive promotional offers and deals' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(item.key)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key] ? 'bg-zinc-900 dark:bg-white' : 'bg-gray-300 dark:bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full shadow transition-transform ${
                          notifications[item.key] ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Logout ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of NEXORA</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* ── Delete Account ── */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
              <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center space-x-2 mb-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
              <button
                onClick={() => { setDeletePassword(''); setDeleteModalOpen(true); }}
                className="px-5 py-2 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                Delete My Account
              </button>
            </div>

            {/* Delete Account Modal */}
            <ConfirmModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleDeleteAccount}
              title="Delete Your Account?"
              message="This action is irreversible. All your data, addresses, and order history will be permanently deleted."
              confirmText="Delete Account"
              requirePassword
              password={deletePassword}
              onPasswordChange={(e) => setDeletePassword(e.target.value)}
              loading={deleteLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
