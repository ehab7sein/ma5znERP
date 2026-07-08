'use strict';

const supabase = require('./supabase');

const databaseConfig = {
  url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasKey: Boolean(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
};

async function testConnection() {
  const { error } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  return true;
}

module.exports = {
  supabase,
  databaseConfig,
  testConnection
};

