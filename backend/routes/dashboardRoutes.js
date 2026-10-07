const express = require('express');
const router = express.Router();
const {
  getTotalStats,
  getAgeWiseStats,
  getMediumWiseStats,
  getUnder35Stats,
  getDistrictWiseStats,
  getMarathonWiseStats,
  getDateWiseStats
} = require('../controllers/participantController');

// GET /api/dashboard/total
router.get('/total', getTotalStats);

// GET /api/dashboard/age-wise
router.get('/age-wise', getAgeWiseStats);

// GET /api/dashboard/medium-wise
router.get('/medium-wise', getMediumWiseStats);

// GET /api/dashboard/under35
router.get('/under35', getUnder35Stats);

// GET /api/dashboard/district-wise
router.get('/district-wise', getDistrictWiseStats);

// GET /api/dashboard/marathon-wise
router.get('/marathon-wise', getMarathonWiseStats);

// GET /api/dashboard/date-wise
router.get('/date-wise', getDateWiseStats);

module.exports = router;
