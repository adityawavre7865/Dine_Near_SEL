const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getMyHotels,
} = require('../controllers/hotelController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/my-hotels', protect, roleCheck('owner', 'admin'), getMyHotels);
router.get('/:id', getHotel);

// Protected routes
router.post('/', protect, roleCheck('owner', 'admin'), createHotel);
router.put('/:id', protect, roleCheck('owner', 'admin'), updateHotel);
router.delete('/:id', protect, roleCheck('owner', 'admin'), deleteHotel);

module.exports = router;
