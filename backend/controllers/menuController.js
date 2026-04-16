const MenuItem = require('../models/MenuItem');
const Hotel = require('../models/Hotel');

// @desc    Get all menu items for a hotel
// @route   GET /api/menu/:hotelId
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category, isVeg, search } = req.query;
    const query = { hotel: req.params.hotelId };

    if (category) query.category = category;
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/item/:id
// @access  Public
const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('hotel', 'name location');
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu/:hotelId
// @access  Private/Owner
const createMenuItem = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    if (hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add items to this hotel' });
    }

    const item = await MenuItem.create({ ...req.body, hotel: req.params.hotelId });
    res.status(201).json({ success: true, message: 'Menu item created', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/item/:id
// @access  Private/Owner
const updateMenuItem = async (req, res) => {
  try {
    let item = await MenuItem.findById(req.params.id).populate('hotel');
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    if (item.hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle availability
// @route   PATCH /api/menu/item/:id/availability
// @access  Private/Owner
const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('hotel');
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    if (item.hotel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ success: true, message: `Item marked as ${item.isAvailable ? 'available' : 'unavailable'}`, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/item/:id
// @access  Private/Owner
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('hotel');
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    if (item.hotel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search all menu items across hotels
// @route   GET /api/menu/search
// @access  Public
const searchMenuItems = async (req, res) => {
  try {
    const { q, category, isVeg, minPrice, maxPrice } = req.query;
    const query = { isAvailable: true };

    if (q) query.name = { $regex: q, $options: 'i' };
    if (category) query.category = category;
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const items = await MenuItem.find(query)
      .populate({ path: 'hotel', match: { status: 'approved' }, select: 'name location image' })
      .sort({ rating: -1 });

    const filtered = items.filter((item) => item.hotel !== null);
    res.json({ success: true, items: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMenuItems, getMenuItem, createMenuItem, updateMenuItem, toggleAvailability, deleteMenuItem, searchMenuItems };
