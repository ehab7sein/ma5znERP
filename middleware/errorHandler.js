'use strict';

function notFoundHandler(req, res) {
  if (req.originalUrl && req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'المسار المطلوب غير موجود'
    });
  }

  return res.status(404).send('الصفحة المطلوبة غير موجودة');
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

