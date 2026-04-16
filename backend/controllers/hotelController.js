const Hotel = require('../models/Hotel');
const MenuItem = require('../models/MenuItem');

// @desc    Get all approved hotels (public)
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const { search, cuisine, location, page = 1, limit = 12 } = req.query;

    const query = { status: 'approved' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) query.cuisine = { $in: [cuisine] };
    if (location) query.location = { $regex: location, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      hotels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('owner', 'name email phone');
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create hotel (owner)
// @route   POST /api/hotels
// @access  Private/Owner
const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, message: 'Hotel submitted for approval', hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Owner
const updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this hotel' });
    }
    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Owner or Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Hotel.findByIdAndDelete(req.params.id);
    await MenuItem.deleteMany({ hotel: req.params.id });
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get owner's own hotels
// @route   GET /api/hotels/my-hotels
// @access  Private/Owner
const getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHotels, getHotel, createHotel, updateHotel, deleteHotel, getMyHotels };
