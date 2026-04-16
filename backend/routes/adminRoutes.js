const express = require('express');
const {
  getStats,
  getAllUsers,
  toggleUserStatus,
  getAllHotels,
  updateHotelStatus,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, roleCheck('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/hotels', getAllHotels);
router.patch('/hotels/:id/status', updateHotelStatus);

module.exports = router;
