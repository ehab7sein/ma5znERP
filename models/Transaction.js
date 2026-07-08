'use strict';

const supabase = require('../config/supabase');

const TRANSACTION_COLUMNS = [
  'id',
  'item_type',
  'item_id',
  'product_size_id',
  'transaction_type',
  'quantity',
  'balance_before',
  'balance_after',
  'supplier_or_receiver',
  'reason',
  'notes',
  'created_at',
  'created_by'
].join(', ');

function cleanTransactionData(data = {}) {
  return {
    item_type: data.item_type,
    item_id: data.item_id,
    product_size_id: data.product_size_id || null,
    transaction_type: data.transaction_type,
    quantity: Number(data.quantity),
    balance_before: Number(data.balance_before),
    balance_after: Number(data.balance_after),
    supplier_or_receiver: data.supplier_or_receiver ? String(data.supplier_or_receiver).trim() : null,
    reason: data.reason ? String(data.reason).trim() : null,
    notes: data.notes ? String(data.notes).trim() : null,
    created_by: data.created_by || null
  };
}

function assertValidTransaction(payload) {
  if (!['shoe', 'packaging'].includes(payload.item_type)) {
    throw new Error('نوع العنصر غير صحيح');
  }

  if (!['IN', 'OUT'].includes(payload.transaction_type)) {
    throw new Error('نوع الحركة غير صحيح');
  }

  if (!Number.isInteger(payload.quantity) || payload.quantity <= 0) {
    throw new Error('الكمية يجب أن تكون رقما صحيحا أكبر من صفر');
  }

  if (!Number.isInteger(payload.balance_before) || payload.balance_before < 0) {
    throw new Error('الرصيد قبل الحركة غير صحيح');
  }

  if (!Number.isInteger(payload.balance_after) || payload.balance_after < 0) {
    throw new Error('الرصيد بعد الحركة غير صحيح');
  }

  if (payload.item_type === 'shoe' && !payload.product_size_id) {
    throw new Error('مقاس الحذاء مطلوب لحركات الأحذية');
  }

  if (payload.item_type === 'packaging' && payload.product_size_id) {
    throw new Error('مقاس الحذاء لا يستخدم مع مواد التعبئة');
  }
}

async function create(data) {
  const payload = cleanTransactionData(data);
  assertValidTransaction(payload);

  const { data: transaction, error } = await supabase
    .from('inventory_transactions')
    .insert(payload)
    .select(TRANSACTION_COLUMNS)
    .single();

  if (error) {
    throw new Error(`تعذر تسجيل الحركة: ${error.message}`);
  }

  return transaction;
}

function applyFilters(query, filters = {}) {
  if (filters.item_type) {
    query = query.eq('item_type', filters.item_type);
  }

  if (filters.transaction_type) {
    query = query.eq('transaction_type', filters.transaction_type);
  }

  if (filters.created_by) {
    query = query.eq('created_by', filters.created_by);
  }

  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  if (filters.query) {
    const pattern = `%${String(filters.query).trim()}%`;
    query = query.or(`supplier_or_receiver.ilike.${pattern},reason.ilike.${pattern},notes.ilike.${pattern}`);
  }

  return query;
}

async function getAll(filters = {}) {
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('inventory_transactions')
    .select(`${TRANSACTION_COLUMNS}, product_sizes(size)`, { count: 'exact' });

  query = applyFilters(query, filters)
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`تعذر جلب سجل الحركات: ${error.message}`);
  }

  const transactions = data || [];

  const shoeIds = [...new Set(transactions.filter(t => t.item_type === 'shoe').map(t => t.item_id))];
  const packagingIds = [...new Set(transactions.filter(t => t.item_type === 'packaging').map(t => t.item_id))];
  const userIds = [...new Set(transactions.filter(t => t.created_by).map(t => t.created_by))];

  const [productsResult, packagingResult, usersResult] = await Promise.all([
    shoeIds.length ? supabase.from('products').select('id, model_name').in('id', shoeIds) : { data: [] },
    packagingIds.length ? supabase.from('packaging_items').select('id, name').in('id', packagingIds) : { data: [] },
    userIds.length ? supabase.from('users').select('id, username').in('id', userIds) : { data: [] }
  ]);

  const productMap = {};
  (productsResult.data || []).forEach(p => { productMap[p.id] = p.model_name; });
  const packagingMap = {};
  (packagingResult.data || []).forEach(p => { packagingMap[p.id] = p.name; });
  const userMap = {};
  (usersResult.data || []).forEach(u => { userMap[u.id] = u.username; });

  const enriched = transactions.map(tx => ({
    ...tx,
    item_name: tx.item_type === 'shoe' ? (productMap[tx.item_id] || '-') : (packagingMap[tx.item_id] || '-'),
    size: tx.item_type === 'shoe' && tx.product_sizes ? tx.product_sizes.size : null,
    username: userMap[tx.created_by] || null,
    formatted_date: new Date(tx.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }),
    formatted_time: new Date(tx.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
  }));

  return {
    data: enriched,
    count: count || 0,
    page,
    limit
  };
}

async function getRecent(limit = 10) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const { data, error } = await supabase
    .from('inventory_transactions')
    .select(`${TRANSACTION_COLUMNS}, product_sizes(size)`)
    .order('created_at', { ascending: false })
    .limit(safeLimit);

  if (error) {
    throw new Error(`تعذر جلب آخر الحركات: ${error.message}`);
  }

  const transactions = data || [];
  const shoeIds = [...new Set(transactions.filter(t => t.item_type === 'shoe').map(t => t.item_id))];
  const packagingIds = [...new Set(transactions.filter(t => t.item_type === 'packaging').map(t => t.item_id))];

  const [productsResult, packagingResult] = await Promise.all([
    shoeIds.length ? supabase.from('products').select('id, model_name').in('id', shoeIds) : { data: [] },
    packagingIds.length ? supabase.from('packaging_items').select('id, name').in('id', packagingIds) : { data: [] }
  ]);

  const productMap = {};
  (productsResult.data || []).forEach(p => { productMap[p.id] = p.model_name; });
  const packagingMap = {};
  (packagingResult.data || []).forEach(p => { packagingMap[p.id] = p.name; });

  return transactions.map(tx => ({
    ...tx,
    item_name: tx.item_type === 'shoe' ? (productMap[tx.item_id] || '-') : (packagingMap[tx.item_id] || '-'),
    size: tx.item_type === 'shoe' && tx.product_sizes ? tx.product_sizes.size : null
  }));
}

async function getDailyCount() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('inventory_transactions')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', start.toISOString());

  if (error) {
    throw new Error(`تعذر حساب حركات اليوم: ${error.message}`);
  }

  return count || 0;
}

async function search(query) {
  return getAll({
    query,
    page: 1,
    limit: 50
  });
}

module.exports = {
  create,
  getAll,
  getRecent,
  getDailyCount,
  search
};

