const express = require('express');
const {
  getProfile,
  updateProfile,
  getPreferences,
  toggleFavoriteHotel,
  toggleFavoriteItem,
  updateDietaryPrefs,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/preferences', protect, getPreferences);
router.post('/preferences/hotel/:hotelId', protect, toggleFavoriteHotel);
router.post('/preferences/item/:itemId', protect, toggleFavoriteItem);
router.put('/preferences/dietary', protect, updateDietaryPrefs);

module.exports = router;
