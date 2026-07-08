'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');

router.get('/products', requireAuth, productController.showPage);
router.get('/api/products', requireAuth, productController.getAll);
router.get('/api/products/search', requireAuth, productController.search);

router.post('/api/products', requireAuth, productController.create);
router.put('/api/products/:id', requireAuth, productController.update);
router.delete('/api/products/:id', requireAuth, productController.delete);

module.exports = router;
