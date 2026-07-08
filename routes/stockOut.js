'use strict';

const express = require('express');
const router = express.Router();
const stockOutController = require('../controllers/stockOutController');
const { requireAuth } = require('../middleware/auth');

router.get('/transactions/out', requireAuth, stockOutController.showForm);
router.post('/api/transactions/out', requireAuth, stockOutController.processStockOut);

module.exports = router;
