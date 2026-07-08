'use strict';

const Product = require('../models/Product');
const ProductSize = require('../models/ProductSize');
const PackagingItem = require('../models/PackagingItem');
const Transaction = require('../models/Transaction');
const supabase = require('../config/supabase');

async function printStockReport(req, res, next) {
  try {
    const products = await Product.getAllWithSizes();
    const packagingItems = await PackagingItem.getAll();

    const { data: sizeData } = await supabase
      .from('product_sizes')
      .select('quantity');

    const totalShoesQty = sizeData
      ? sizeData.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
      : 0;

    const totalPackagingQty = packagingItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    const lowStockShoes = await ProductSize.getLowStock();
    const lowStockPackaging = await PackagingItem.getLowStock();

    const printDate = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    res.render('pages/print-stock', {
      title: 'تقرير المخزون',
      layout: false,
      products,
      packagingItems,
      totalShoesQty,
      totalPackagingQty,
      lowStockShoesCount: lowStockShoes.length,
      lowStockPackagingCount: lowStockPackaging.length,
      printDate
    });
  } catch (error) {
    next(error);
  }
}

async function printTransactions(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const transactions = await Transaction.getRecent(limit);

    const printDate = new Date().toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    res.render('pages/print-transactions', {
      title: 'سجل الحركات',
      layout: false,
      transactions,
      printDate
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  printStockReport,
  printTransactions
};
