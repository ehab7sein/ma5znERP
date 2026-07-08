'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { databaseConfig } = require('./config/database');
const { setUserLocals } = require('./middleware/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'ma5znerp.sid',
  secret: process.env.SESSION_SECRET || 'change-this-to-a-long-random-string',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: Number(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 8
  }
}));

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const productsRoutes = require('./routes/products');
const sizesRoutes = require('./routes/sizes');

app.use(setUserLocals);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(productsRoutes);
app.use(sizesRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ماخزنERP - نظام إدارة مخزن الأحذية',
    version: '1.0.0',
    database: {
      configured: databaseConfig.hasKey,
      url: databaseConfig.url
    },
    auth: {
      authenticated: Boolean(req.session.userId),
      user: req.user
    }
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Supabase configured: ${databaseConfig.hasKey ? 'yes' : 'no'}`);
});

module.exports = app;

