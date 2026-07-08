'use strict';

const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/sizeController');
const { requireAuth } = require('../middleware/auth');

router.get('/products/:id/sizes', requireAuth, sizeController.showPage);
router.get('/api/products/:id/sizes', requireAuth, sizeController.getAll);
router.post('/api/products/:id/sizes', requireAuth, sizeController.create);
router.put('/api/sizes/:id', requireAuth, sizeController.update);
router.delete('/api/sizes/:id', requireAuth, sizeController.delete);

module.exports = router;
