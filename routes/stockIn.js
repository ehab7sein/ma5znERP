'use strict';

const express = require('express');
const router = express.Router();
const stockInController = require('../controllers/stockInController');
const { requireAuth } = require('../middleware/auth');

router.get('/transactions/in', requireAuth, stockInController.showForm);
router.get('/api/products/:id/sizes-for-select', requireAuth, stockInController.getSizesByProduct);
router.post('/api/transactions/in', requireAuth, stockInController.processStockIn);

module.exports = router;
