'use strict';

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth } = require('../middleware/auth');

router.get('/reports', requireAuth, reportController.showPage);
router.get('/api/reports/stats', requireAuth, reportController.getStats);
router.get('/api/reports/categories', requireAuth, reportController.getCategoryDistribution);
router.get('/api/reports/brands', requireAuth, reportController.getBrandDistribution);
router.get('/api/reports/top-moving', requireAuth, reportController.getTopMoving);
router.get('/api/reports/monthly', requireAuth, reportController.getMonthlyReport);

module.exports = router;
