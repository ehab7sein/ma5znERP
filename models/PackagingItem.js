'use strict';

const supabase = require('../config/supabase');

const PACKAGING_COLUMNS = 'id, name, quantity, minimum_quantity, created_at';

function cleanPackagingData(data = {}) {
  return {
    name: data.name ? String(data.name).trim() : undefined,
    quantity: data.quantity === undefined ? undefined : Number(data.quantity),
    minimum_quantity: data.minimum_quantity === undefined ? undefined : Number(data.minimum_quantity)
  };
}

function assertNonNegativeInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} يجب أن يكون رقما صحيحا غير سالب`);
  }
}

function assertPositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} يجب أن يكون رقما صحيحا أكبر من صفر`);
  }
}

function removeUndefined(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

async function getAll() {
  const { data, error } = await supabase
    .from('packaging_items')
    .select(PACKAGING_COLUMNS)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`تعذر جلب مواد التعبئة: ${error.message}`);
  }

  return data || [];
}

async function getById(id) {
  const { data, error } = await supabase
    .from('packaging_items')
    .select(PACKAGING_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر جلب مادة التعبئة: ${error.message}`);
  }

  return data;
}

async function search(query) {
  const term = String(query || '').trim();

  if (!term) {
    return getAll();
  }

  const { data, error } = await supabase
    .from('packaging_items')
    .select(PACKAGING_COLUMNS)
    .ilike('name', `%${term}%`)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`تعذر البحث في مواد التعبئة: ${error.message}`);
  }

  return data || [];
}

async function create(data) {
  const payload = removeUndefined(cleanPackagingData(data));
  assertNonNegativeInteger(payload.quantity ?? 0, 'الكمية');
  assertNonNegativeInteger(payload.minimum_quantity ?? 0, 'الحد الأدنى');

  const { data: item, error } = await supabase
    .from('packaging_items')
    .insert(payload)
    .select(PACKAGING_COLUMNS)
    .single();

  if (error) {
    throw new Error(`تعذر إنشاء مادة التعبئة: ${error.message}`);
  }

  return item;
}

async function update(id, data) {
  const payload = removeUndefined(cleanPackagingData(data));

  if (payload.quantity !== undefined) {
    assertNonNegativeInteger(payload.quantity, 'الكمية');
  }

  if (payload.minimum_quantity !== undefined) {
    assertNonNegativeInteger(payload.minimum_quantity, 'الحد الأدنى');
  }

  const { data: item, error } = await supabase
    .from('packaging_items')
    .update(payload)
    .eq('id', id)
    .select(PACKAGING_COLUMNS)
    .single();

  if (error) {
    throw new Error(`تعذر تحديث مادة التعبئة: ${error.message}`);
  }

  return item;
}

async function remove(id) {
  const { error } = await supabase
    .from('packaging_items')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`تعذر حذف مادة التعبئة: ${error.message}`);
  }

  return true;
}

async function addQuantity(id, amount) {
  const quantityToAdd = Number(amount);
  assertPositiveInteger(quantityToAdd, 'الكمية المضافة');

  const current = await getById(id);
  if (!current) {
    throw new Error('مادة التعبئة غير موجودة');
  }

  return update(id, {
    quantity: current.quantity + quantityToAdd
  });
}

async function deductQuantity(id, amount) {
  const quantityToDeduct = Number(amount);
  assertPositiveInteger(quantityToDeduct, 'الكمية المصروفة');

  const current = await getById(id);
  if (!current) {
    throw new Error('مادة التعبئة غير موجودة');
  }

  if (current.quantity < quantityToDeduct) {
    throw new Error('لا يمكن صرف كمية أكبر من الرصيد المتاح');
  }

  return update(id, {
    quantity: current.quantity - quantityToDeduct
  });
}

async function getLowStock() {
  const { data, error } = await supabase
    .from('packaging_items')
    .select(PACKAGING_COLUMNS)
    .order('quantity', { ascending: true });

  if (error) {
    throw new Error(`تعذر جلب مواد التعبئة منخفضة الكمية: ${error.message}`);
  }

  return (data || []).filter((item) => item.quantity <= item.minimum_quantity);
}

module.exports = {
  getAll,
  getById,
  search,
  create,
  update,
  delete: remove,
  addQuantity,
  deductQuantity,
  getLowStock
};
