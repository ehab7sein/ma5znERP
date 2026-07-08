'use strict';

const supabase = require('../config/supabase');

const SIZE_COLUMNS = 'id, product_id, size, quantity, minimum_quantity, created_at';

function cleanSizeData(data = {}) {
  return {
    size: data.size ? String(data.size).trim() : undefined,
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

async function getByProductId(productId) {
  const { data, error } = await supabase
    .from('product_sizes')
    .select(SIZE_COLUMNS)
    .eq('product_id', productId)
    .order('size', { ascending: true });

  if (error) {
    throw new Error(`تعذر جلب المقاسات: ${error.message}`);
  }

  return data || [];
}

async function getById(id) {
  const { data, error } = await supabase
    .from('product_sizes')
    .select(SIZE_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر جلب المقاس: ${error.message}`);
  }

  return data;
}

async function create(productId, data) {
  const payload = {
    product_id: productId,
    ...removeUndefined(cleanSizeData(data))
  };

  assertNonNegativeInteger(payload.quantity ?? 0, 'الكمية');
  assertNonNegativeInteger(payload.minimum_quantity ?? 0, 'الحد الأدنى');

  const { data: size, error } = await supabase
    .from('product_sizes')
    .insert(payload)
    .select(SIZE_COLUMNS)
    .single();

  if (error) {
    throw new Error(`تعذر إنشاء المقاس: ${error.message}`);
  }

  return size;
}

async function update(id, data) {
  const payload = removeUndefined(cleanSizeData(data));

  if (payload.quantity !== undefined) {
    assertNonNegativeInteger(payload.quantity, 'الكمية');
  }

  if (payload.minimum_quantity !== undefined) {
    assertNonNegativeInteger(payload.minimum_quantity, 'الحد الأدنى');
  }

  const { data: size, error } = await supabase
    .from('product_sizes')
    .update(payload)
    .eq('id', id)
    .select(SIZE_COLUMNS)
    .single();

  if (error) {
    throw new Error(`تعذر تحديث المقاس: ${error.message}`);
  }

  return size;
}

async function remove(id) {
  const { error } = await supabase
    .from('product_sizes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`تعذر حذف المقاس: ${error.message}`);
  }

  return true;
}

async function addQuantity(id, amount) {
  const quantityToAdd = Number(amount);
  assertPositiveInteger(quantityToAdd, 'الكمية المضافة');

  const current = await getById(id);
  if (!current) {
    throw new Error('المقاس غير موجود');
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
    throw new Error('المقاس غير موجود');
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
    .from('product_sizes')
    .select(`${SIZE_COLUMNS}, products(id, model_name, category, color, brand)`)
    .order('quantity', { ascending: true });

  if (error) {
    throw new Error(`تعذر جلب المقاسات منخفضة الكمية: ${error.message}`);
  }

  return (data || []).filter((size) => size.quantity <= size.minimum_quantity);
}

module.exports = {
  getByProductId,
  getById,
  create,
  update,
  delete: remove,
  addQuantity,
  deductQuantity,
  getLowStock
};
