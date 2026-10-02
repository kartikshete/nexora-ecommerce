const User = require('../models/User');

// ─────────────────────────────────────────────────
// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
// ─────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
        notificationPreferences: user.notificationPreferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
// ─────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    // Only allow specific fields
    const updates = {};
    if (name !== undefined) {
      if (!name.trim() || name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
      }
      if (name.trim().length > 50) {
        return res.status(400).json({ success: false, message: 'Name cannot exceed 50 characters.' });
      }
      updates.name = name.trim();
    }
    if (phone !== undefined) {
      updates.phone = phone.trim();
    }
    if (avatar !== undefined) {
      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
        notificationPreferences: user.notificationPreferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error('UpdateProfile error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
// ─────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'All password fields are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
// ─────────────────────────────────────────────────
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required to delete your account.' });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password is incorrect.' });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ success: true, message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('DeleteAccount error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
// ─────────────────────────────────────────────────
const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine, city, state, pincode, country, isDefault } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All address fields are required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // If setting as default, unset all others
    if (isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    // If first address, make it default automatically
    const makeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: (country || 'India').trim(),
      isDefault: makeDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully.',
      addresses: user.addresses,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error('AddAddress error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Get all addresses
// @route   GET /api/users/addresses
// @access  Private
// ─────────────────────────────────────────────────
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    console.error('GetAddresses error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Update an address
// @route   PUT /api/users/addresses/:id
// @access  Private
// ─────────────────────────────────────────────────
const updateAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine, city, state, pincode, country, isDefault } = req.body;
    const addressId = req.params.id;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    // If setting as default, unset all others
    if (isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    // Update fields
    if (fullName !== undefined) address.fullName = fullName.trim();
    if (phone !== undefined) address.phone = phone.trim();
    if (addressLine !== undefined) address.addressLine = addressLine.trim();
    if (city !== undefined) address.city = city.trim();
    if (state !== undefined) address.state = state.trim();
    if (pincode !== undefined) address.pincode = pincode.trim();
    if (country !== undefined) address.country = country.trim();
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully.',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('UpdateAddress error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Delete an address
// @route   DELETE /api/users/addresses/:id
// @access  Private
// ─────────────────────────────────────────────────
const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    const wasDefault = address.isDefault;
    user.addresses.pull(addressId);

    // If deleted address was default, make the first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully.',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('DeleteAddress error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Set an address as default
// @route   PUT /api/users/addresses/:id/default
// @access  Private
// ─────────────────────────────────────────────────
const setDefaultAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    // Unset all, then set the target
    user.addresses.forEach((addr) => { addr.isDefault = false; });
    address.isDefault = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated.',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('SetDefaultAddress error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

// ─────────────────────────────────────────────────
// @desc    Update notification preferences
// @route   PUT /api/users/notifications
// @access  Private
// ─────────────────────────────────────────────────
const updateNotifications = async (req, res) => {
  try {
    const { email, orders, promotions } = req.body;

    const updates = {};
    if (email !== undefined) updates['notificationPreferences.email'] = email;
    if (orders !== undefined) updates['notificationPreferences.orders'] = orders;
    if (promotions !== undefined) updates['notificationPreferences.promotions'] = promotions;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated.',
      notificationPreferences: user.notificationPreferences,
    });
  } catch (error) {
    console.error('UpdateNotifications error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  updateNotifications,
};
