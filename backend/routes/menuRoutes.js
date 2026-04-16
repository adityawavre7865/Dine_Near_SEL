const express = require('express');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
  searchMenuItems,
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get('/search', searchMenuItems);
router.get('/item/:id', getMenuItem);
router.get('/:hotelId', getMenuItems);

// Protected routes (owner only)
router.post('/:hotelId', protect, roleCheck('owner', 'admin'), createMenuItem);
router.put('/item/:id', protect, roleCheck('owner', 'admin'), updateMenuItem);
router.patch('/item/:id/availability', protect, roleCheck('owner', 'admin'), toggleAvailability);
router.delete('/item/:id', protect, roleCheck('owner', 'admin'), deleteMenuItem);

module.exports = router;
