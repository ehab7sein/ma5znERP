'use strict';

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

router.get('/dashboard', requireAuth, dashboardController.showDashboard);
router.get('/api/dashboard/stats', requireAuth, dashboardController.getStats);

module.exports = router;
