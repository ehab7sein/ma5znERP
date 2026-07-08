'use strict';

const Product = require('../models/Product');
const ProductSize = require('../models/ProductSize');
const PackagingItem = require('../models/PackagingItem');
const Transaction = require('../models/Transaction');
const supabase = require('../config/supabase');

function showPage(req, res) {
  res.render('pages/reports', { title: 'التقارير' });
}

async function getStats(req, res, next) {
  try {
    const products = await Product.getAll();
    const packagingItems = await PackagingItem.getAll();
    const lowStockShoes = await ProductSize.getLowStock();
    const lowStockPackaging = await PackagingItem.getLowStock();

    const { data: sizeData } = await supabase
      .from('product_sizes')
      .select('quantity');

    const totalSizes = sizeData ? sizeData.length : 0;
    const totalShoesQuantity = sizeData
      ? sizeData.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
      : 0;

    const totalPackagingQuantity = packagingItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    return res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalSizes,
        totalShoesQuantity,
        totalPackagingQuantity,
        lowStockShoesCount: lowStockShoes.length,
        lowStockPackagingCount: lowStockPackaging.length,
        products
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getCategoryDistribution(req, res, next) {
  try {
    const products = await Product.getAll();

    const distribution = {};
    products.forEach(p => {
      const cat = p.category || 'أخرى';
      distribution[cat] = (distribution[cat] || 0) + 1;
    });

    const data = Object.entries(distribution).map(([category, count]) => ({
      category,
      count
    }));

    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getBrandDistribution(req, res, next) {
  try {
    const products = await Product.getAll();

    const distribution = {};
    products.forEach(p => {
      const brand = p.brand || 'بدون علامة';
      distribution[brand] = (distribution[brand] || 0) + 1;
    });

    const data = Object.entries(distribution).map(([brand, count]) => ({
      brand,
      count
    }));

    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getTopMoving(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const { data, error } = await supabase
      .from('inventory_transactions')
      .select('item_id, product_size_id, item_type, quantity, transaction_type, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) throw new Error(`تعذر جلب البيانات: ${error.message}`);

    const movement = {};
    (data || []).forEach(tx => {
      const key = tx.product_size_id || tx.item_id;
      if (!key) return;
      movement[key] = movement[key] || { totalIn: 0, totalOut: 0, count: 0, itemType: tx.item_type };
      if (tx.transaction_type === 'IN') movement[key].totalIn += tx.quantity;
      else movement[key].totalOut += tx.quantity;
      movement[key].count += 1;
    });

    const sorted = Object.entries(movement)
      .map(([id, m]) => ({ id, ...m, totalMovement: m.totalIn + m.totalOut }))
      .sort((a, b) => b.totalMovement - a.totalMovement)
      .slice(0, limit);

    return res.json({ success: true, data: sorted });
  } catch (error) {
    next(error);
  }
}

async function getMonthlyReport(req, res, next) {
  try {
    const month = String(req.query.month || (new Date().getMonth() + 1)).padStart(2, '0');
    const year = req.query.year || new Date().getFullYear();

    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('inventory_transactions')
      .select('transaction_type, quantity, item_type')
      .gte('created_at', startDate)
      .lte('created_at', `${endDate}T23:59:59.999Z`);

    if (error) throw new Error(`تعذر جلب التقرير الشهري: ${error.message}`);

    let totalIn = 0;
    let totalOut = 0;
    let shoeIn = 0;
    let shoeOut = 0;
    let packagingIn = 0;
    let packagingOut = 0;

    (data || []).forEach(tx => {
      if (tx.transaction_type === 'IN') {
        totalIn += tx.quantity;
        if (tx.item_type === 'shoe') shoeIn += tx.quantity;
        else packagingIn += tx.quantity;
      } else {
        totalOut += tx.quantity;
        if (tx.item_type === 'shoe') shoeOut += tx.quantity;
        else packagingOut += tx.quantity;
      }
    });

    return res.json({
      success: true,
      data: {
        month: Number(month),
        year: Number(year),
        totalTransactions: (data || []).length,
        totalIn,
        totalOut,
        shoeIn,
        shoeOut,
        packagingIn,
        packagingOut
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showPage,
  getStats,
  getCategoryDistribution,
  getBrandDistribution,
  getTopMoving,
  getMonthlyReport
};
