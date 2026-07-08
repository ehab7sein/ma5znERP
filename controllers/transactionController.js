'use strict';

const Transaction = require('../models/Transaction');

function showPage(req, res) {
  res.render('pages/transactions', { title: 'سجل الحركات' });
}

async function getAll(req, res, next) {
  try {
    const filters = {
      transaction_type: req.query.type || undefined,
      item_type: req.query.itemType || undefined,
      date_from: req.query.dateFrom || undefined,
      date_to: req.query.dateTo || undefined,
      query: req.query.search || undefined,
      page: req.query.page || 1,
      limit: req.query.limit || 50
    };

    const result = await Transaction.getAll(filters);

    return res.json({
      success: true,
      data: result.data,
      count: result.count,
      page: result.page,
      limit: result.limit
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { data, error } = await require('../config/supabase')
      .from('inventory_transactions')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw new Error(`تعذر جلب الحركة: ${error.message}`);

    if (!data) {
      return res.status(404).json({ success: false, message: 'الحركة غير موجودة' });
    }

    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showPage,
  getAll,
  getById
};
