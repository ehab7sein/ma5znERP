'use strict';

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { requireAuth } = require('../middleware/auth');

router.get('/transactions', requireAuth, transactionController.showPage);
router.get('/api/transactions', requireAuth, transactionController.getAll);
router.get('/api/transactions/:id', requireAuth, transactionController.getById);

module.exports = router;
