'use strict';

const express = require('express');
const authController = require('../controllers/authController');
const { redirectIfAuth } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validate');

const router = express.Router();

router.get('/login', redirectIfAuth, authController.showLogin);
router.post('/login', redirectIfAuth, validateLogin, authController.login);
router.post('/logout', authController.logout);

module.exports = router;

