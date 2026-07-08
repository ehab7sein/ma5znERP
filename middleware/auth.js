'use strict';

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    if (req.originalUrl && req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولا'
      });
    }

    return res.redirect('/login');
  }

  return next();
}

function redirectIfAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }

  return next();
}

function setUserLocals(req, res, next) {
  const user = req.session && req.session.user
    ? req.session.user
    : null;

  req.user = user;
  res.locals.user = user;
  res.locals.isAuthenticated = Boolean(user);

  return next();
}

module.exports = {
  requireAuth,
  redirectIfAuth,
  setUserLocals
};

