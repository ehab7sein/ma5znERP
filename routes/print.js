'use strict';

const express = require('express');
const router = express.Router();
const printController = require('../controllers/printController');
const { requireAuth } = require('../middleware/auth');

router.get('/print/stock', requireAuth, printController.printStockReport);
router.get('/print/transactions', requireAuth, printController.printTransactions);

module.exports = router;
