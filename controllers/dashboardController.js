'use strict';

const Product = require('../models/Product');
const ProductSize = require('../models/ProductSize');
const PackagingItem = require('../models/PackagingItem');
const Transaction = require('../models/Transaction');
const supabase = require('../config/supabase');

function showDashboard(req, res) {
  res.render('pages/dashboard', { title: 'لوحة التحكم' });
}

async function getStats(req, res, next) {
  try {
    const products = await Product.getAll();
    const lowStockShoes = await ProductSize.getLowStock();
    const packagingItems = await PackagingItem.getAll();
    const lowStockPackaging = await PackagingItem.getLowStock();
    const dailyCount = await Transaction.getDailyCount();
    const recentTransactions = await Transaction.getRecent(10);
    
    const { data: sizeData, error } = await supabase
      .from('product_sizes')
      .select('quantity');
      
    let totalSizes = 0;
    let totalShoesQuantity = 0;
    
    if (!error && sizeData) {
      totalSizes = sizeData.length;
      totalShoesQuantity = sizeData.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    }
    
    const totalPackagingQuantity = packagingItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    return res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalSizes,
        totalShoesQuantity,
        totalPackagingQuantity,
        lowStockShoesCount: lowStockShoes.length,
        lowStockPackagingCount: lowStockPackaging.length,
        dailyTransactionsCount: dailyCount
      },
      recentTransactions
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showDashboard,
  getStats
};
