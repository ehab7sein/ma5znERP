'use strict';

function sendValidationError(res, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}

function isBlank(value) {
  return typeof value !== 'string' || value.trim().length === 0;
}

function toPositiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function validateLogin(req, res, next) {
  const { username, password } = req.body || {};

  if (isBlank(username)) {
    return sendValidationError(res, 'اسم المستخدم مطلوب');
  }

  if (isBlank(password)) {
    return sendValidationError(res, 'كلمة المرور مطلوبة');
  }

  req.body.username = username.trim();
  req.body.password = String(password);

  return next();
}

function validatePositiveQuantity(req, res, next) {
  const quantity = toPositiveInteger(req.body && req.body.quantity);

  if (!quantity) {
    return sendValidationError(res, 'الكمية يجب أن تكون رقما صحيحا أكبر من صفر');
  }

  req.body.quantity = quantity;
  return next();
}

function validateRequiredFields(fields) {
  return (req, res, next) => {
    const missingField = fields.find((field) => isBlank(req.body && req.body[field]));

    if (missingField) {
      return sendValidationError(res, `الحقل ${missingField} مطلوب`);
    }

    fields.forEach((field) => {
      req.body[field] = req.body[field].trim();
    });

    return next();
  };
}

module.exports = {
  validateLogin,
  validatePositiveQuantity,
  validateRequiredFields
};

