'use strict';

const Product = require('../models/Product');
const ProductSize = require('../models/ProductSize');
const PackagingItem = require('../models/PackagingItem');
const Transaction = require('../models/Transaction');
const supabase = require('../config/supabase');

async function printStockReport(req, res, next) {
  try {
    const includePackaging = req.query.includePackaging !== 'false';
    const products = await Product.getAllWithSizes();
    const packagingItems = includePackaging ? await PackagingItem.getAll() : [];

    const { data: sizeData } = await supabase
      .from('product_sizes')
      .select('quantity');

    const totalShoesQty = sizeData
      ? sizeData.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
      : 0;

    const totalPackagingQty = packagingItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    const lowStockShoes = await ProductSize.getLowStock();
    const lowStockPackaging = includePackaging ? await PackagingItem.getLowStock() : [];

    const now = new Date();
    const printDate = now.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const printTime = now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });

    res.render('pages/print-stock', {
      title: 'تقرير المخزون',
      layout: false,
      products,
      packagingItems,
      includePackaging,
      totalShoesQty,
      totalPackagingQty,
      lowStockShoesCount: lowStockShoes.length,
      lowStockPackagingCount: lowStockPackaging.length,
      printDate,
      printTime
    });
  } catch (error) {
    next(error);
  }
}

async function printTransactions(req, res, next) {
  try {
    const filters = {};
    if (req.query.dateFrom) filters.date_from = req.query.dateFrom;
    if (req.query.dateTo) filters.date_to = req.query.dateTo;
    filters.limit = 500;

    const result = await Transaction.getAll(filters);
    const transactions = result.data || [];

    const now = new Date();
    const printDate = now.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const printTime = now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let dateRangeLabel = 'جميع الفترات';
    if (req.query.dateFrom && req.query.dateTo) {
      const from = new Date(req.query.dateFrom).toLocaleDateString('ar-SA');
      const to = new Date(req.query.dateTo).toLocaleDateString('ar-SA');
      dateRangeLabel = `من ${from} إلى ${to}`;
    } else if (req.query.dateFrom) {
      const from = new Date(req.query.dateFrom).toLocaleDateString('ar-SA');
      dateRangeLabel = `من ${from}`;
    } else if (req.query.dateTo) {
      const to = new Date(req.query.dateTo).toLocaleDateString('ar-SA');
      dateRangeLabel = `حتى ${to}`;
    }

    res.render('pages/print-transactions', {
      title: 'سجل الحركات',
      layout: false,
      transactions,
      printDate,
      printTime,
      dateRangeLabel,
      totalCount: result.count || 0
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  printStockReport,
  printTransactions
};
