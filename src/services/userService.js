import axios from '../api/axiosInstance';

// ─── Profile ─────────────────────────────────────
export const getProfile = () => axios.get('/api/users/profile');

export const updateProfile = (data) => axios.put('/api/users/profile', data);

// ─── Password ────────────────────────────────────
export const changePassword = (data) => axios.put('/api/users/change-password', data);

// ─── Account ─────────────────────────────────────
export const deleteAccount = (password) => axios.delete('/api/users/account', { data: { password } });

// ─── Addresses ───────────────────────────────────
export const getAddresses = () => axios.get('/api/users/addresses');

export const addAddress = (data) => axios.post('/api/users/addresses', data);

export const updateAddress = (id, data) => axios.put(`/api/users/addresses/${id}`, data);

export const deleteAddress = (id) => axios.delete(`/api/users/addresses/${id}`);

export const setDefaultAddress = (id) => axios.put(`/api/users/addresses/${id}/default`);

// ─── Notifications ───────────────────────────────
export const updateNotifications = (data) => axios.put('/api/users/notifications', data);
