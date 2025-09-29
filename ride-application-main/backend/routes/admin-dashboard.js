const express = require("express");
const router = express.Router();
const userModel = require("../models/users");
const driverModel = require("../models/driver");
const rideModel = require("../models/createride");
const authenticateToken = require("../middleware/auth");

// Get dashboard statistics
router.get('/admin/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const [totalUsers, totalDrivers, totalRides] = await Promise.all([
      userModel.countDocuments(),
      driverModel.countDocuments(),
      rideModel.countDocuments()
    ]);

    const activeRides = await rideModel.countDocuments({ ridestatus: 1 });
    
    // Calculate total revenue (if you have a field for ride cost)
    const revenueData = await rideModel.aggregate([
      { $match: { ridestatus: 2 } }, // Completed rides
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDrivers,
        totalRides,
        activeRides,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// Get recent activities
router.get('/admin/recent-activities', authenticateToken, async (req, res) => {
  try {
    const recentRides = await rideModel.find()
      .populate('userId', 'username useremail')
      .populate('driverId', 'drivername')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: recentRides
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activities' });
  }
});

module.exports = router;