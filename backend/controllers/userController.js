const User = require('../models/User');
const UserPreference = require('../models/UserPreference');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
const getPreferences = async (req, res) => {
  try {
    const prefs = await UserPreference.findOne({ user: req.user._id })
      .populate('favoriteHotels', 'name location image rating')
      .populate('favoriteItems', 'name price image isAvailable hotel');
    res.json({ success: true, preferences: prefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite hotel
// @route   POST /api/users/preferences/hotel/:hotelId
// @access  Private
const toggleFavoriteHotel = async (req, res) => {
  try {
    let prefs = await UserPreference.findOne({ user: req.user._id });
    if (!prefs) prefs = await UserPreference.create({ user: req.user._id });

    const hotelId = req.params.hotelId;
    const index = prefs.favoriteHotels.indexOf(hotelId);

    if (index > -1) {
      prefs.favoriteHotels.splice(index, 1);
    } else {
      prefs.favoriteHotels.push(hotelId);
    }

    await prefs.save();
    const action = index > -1 ? 'removed from' : 'added to';
    res.json({ success: true, message: `Hotel ${action} favorites`, favorites: prefs.favoriteHotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite menu item
// @route   POST /api/users/preferences/item/:itemId
// @access  Private
const toggleFavoriteItem = async (req, res) => {
  try {
    let prefs = await UserPreference.findOne({ user: req.user._id });
    if (!prefs) prefs = await UserPreference.create({ user: req.user._id });

    const itemId = req.params.itemId;
    const index = prefs.favoriteItems.indexOf(itemId);

    if (index > -1) {
      prefs.favoriteItems.splice(index, 1);
    } else {
      prefs.favoriteItems.push(itemId);
    }

    await prefs.save();
    const action = index > -1 ? 'removed from' : 'added to';
    res.json({ success: true, message: `Item ${action} favorites`, favorites: prefs.favoriteItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update dietary preferences
// @route   PUT /api/users/preferences/dietary
// @access  Private
const updateDietaryPrefs = async (req, res) => {
  try {
    const { dietaryPreferences, preferredCuisines } = req.body;
    let prefs = await UserPreference.findOneAndUpdate(
      { user: req.user._id },
      { dietaryPreferences, preferredCuisines },
      { new: true, upsert: true }
    );
    res.json({ success: true, preferences: prefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getPreferences, toggleFavoriteHotel, toggleFavoriteItem, updateDietaryPrefs };
