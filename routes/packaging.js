'use strict';

const express = require('express');
const router = express.Router();
const packagingController = require('../controllers/packagingController');
const { requireAuth } = require('../middleware/auth');

router.get('/packaging', requireAuth, packagingController.showPage);
router.get('/api/packaging', requireAuth, packagingController.getAll);
router.get('/api/packaging/search', requireAuth, packagingController.search);
router.post('/api/packaging', requireAuth, packagingController.create);
router.put('/api/packaging/:id', requireAuth, packagingController.update);
router.delete('/api/packaging/:id', requireAuth, packagingController.delete);
router.post('/api/packaging/:id/in', requireAuth, packagingController.addQuantity);
router.post('/api/packaging/:id/out', requireAuth, packagingController.deductQuantity);

module.exports = router;
