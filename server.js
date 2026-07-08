'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('cookie-session');
const morgan = require('morgan');
const { databaseConfig } = require('./config/database');
const { setUserLocals } = require('./middleware/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1);

app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'ma5znerp.sid',
  keys: [process.env.SESSION_SECRET || 'change-this-to-a-long-random-string'],
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  maxAge: Number(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 8
}));

const dashboardRoutes = require('./routes/dashboard');
const productsRoutes = require('./routes/products');
const sizesRoutes = require('./routes/sizes');
const stockInRoutes = require('./routes/stockIn');
const stockOutRoutes = require('./routes/stockOut');
const transactionsRoutes = require('./routes/transactions');
const packagingRoutes = require('./routes/packaging');
const reportsRoutes = require('./routes/reports');
const printRoutes = require('./routes/print');

app.use(setUserLocals);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(productsRoutes);
app.use(sizesRoutes);
app.use(stockInRoutes);
app.use(stockOutRoutes);
app.use(transactionsRoutes);
app.use(packagingRoutes);
app.use(reportsRoutes);
app.use(printRoutes);

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

