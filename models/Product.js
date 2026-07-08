'use strict';

const supabase = require('../config/supabase');

const PRODUCT_COLUMNS = 'id, model_name, category, color, material, brand, notes, created_at';

function cleanProductData(data = {}) {
  return {
    model_name: data.model_name ? String(data.model_name).trim() : undefined,
    category: data.category ? String(data.category).trim() : undefined,
    color: data.color ? String(data.color).trim() : undefined,
    material: data.material ? String(data.material).trim() : null,
    brand: data.brand ? String(data.brand).trim() : null,
    notes: data.notes ? String(data.notes).trim() : null
  };
}

function removeUndefined(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

async function getAll() {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`تعذر جلب الموديلات: ${error.message}`);
  }

  return data || [];
}

async function getById(id) {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`تعذر جلب الموديل: ${error.message}`);
  }

  return data;
}

async function search(query) {
  const term = String(query || '').trim();

  if (!term) {
    return getAll();
  }

  const pattern = `%${term}%`;
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .or(`model_name.ilike.${pattern},category.ilike.${pattern},color.ilike.${pattern},brand.ilike.${pattern},material.ilike.${pattern}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`تعذر البحث في الموديلات: ${error.message}`);
  }

  return data || [];
}

async function create(data) {
  const payload = removeUndefined(cleanProductData(data));

  const { data: product, error } = await supabase
    .from('products')
    .insert(payload)
    .select(PRODUCT_COLUMNS)
    .single();

  if (error) {
    throw new Error(`تعذر إنشاء الموديل: ${error.message}`);
  }

  return product;
}

async function update(id, data) {
  const payload = removeUndefined(cleanProductData(data));

  const { data: product, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select(PRODUCT_COLUMNS)
    .single();

  if (error) {
    throw new Error(`تعذر تحديث الموديل: ${error.message}`);
  }

  return product;
}

async function remove(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`تعذر حذف الموديل: ${error.message}`);
  }

  return true;
}

async function getAllWithSizes() {
  const { data, error } = await supabase
    .from('products')
    .select(`${PRODUCT_COLUMNS}, product_sizes(id, size, quantity, minimum_quantity, created_at)`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`تعذر جلب الموديلات مع المقاسات: ${error.message}`);
  }

  return data || [];
}

module.exports = {
  getAll,
  getById,
  search,
  create,
  update,
  delete: remove,
  getAllWithSizes
};

