'use strict';

const User = require('../models/User');

function showLogin(req, res) {
  return res.status(200).json({
    success: true,
    message: 'صفحة تسجيل الدخول جاهزة وسيتم إنشاء الواجهة في Task 7'
  });
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }

    const passwordIsValid = await User.verifyPassword(password, user.password_hash);

    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }

    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      username: user.username
    };

    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      redirectTo: '/dashboard',
      user: req.session.user
    });
  } catch (error) {
    return next(error);
  }
}

function logout(req, res, next) {
  if (!req.session) {
    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });
  }

  return req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie('ma5znerp.sid');

    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
      redirectTo: '/login'
    });
  });
}

module.exports = {
  showLogin,
  login,
  logout
};

