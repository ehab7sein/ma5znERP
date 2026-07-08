'use strict';

const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

async function findByUsername(username) {
  const cleanUsername = String(username || '').trim();

  if (!cleanUsername) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, username, password_hash, created_at')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر جلب بيانات المستخدم: ${error.message}`);
  }

  return data;
}

async function verifyPassword(input, hash) {
  if (!input || !hash) {
    return false;
  }

  return bcrypt.compare(String(input), hash);
}

module.exports = {
  findByUsername,
  verifyPassword
};

