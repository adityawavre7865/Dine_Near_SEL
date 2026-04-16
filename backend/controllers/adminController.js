const User = require('../models/User');
const Hotel = require('../models/Hotel');
const MenuItem = require('../models/MenuItem');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalOwners, totalHotels, pendingHotels, approvedHotels, totalMenuItems] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Hotel.countDocuments(),
      Hotel.countDocuments({ status: 'pending' }),
      Hotel.countDocuments({ status: 'approved' }),
      MenuItem.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalOwners, totalHotels, pendingHotels, approvedHotels, totalMenuItems },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.json({ success: true, total, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot modify admin account' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all hotels (admin view)
// @route   GET /api/admin/hotels
// @access  Private/Admin
const getAllHotels = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ success: true, total, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject hotel
// @route   PATCH /api/admin/hotels/:id/status
// @access  Private/Admin
const updateHotelStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const hotel = await Hotel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });

    res.json({ success: true, message: `Hotel ${status}`, hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getAllUsers, toggleUserStatus, getAllHotels, updateHotelStatus, deleteUser };
