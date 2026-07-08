'use strict';

const PackagingItem = require('../models/PackagingItem');
const Transaction = require('../models/Transaction');

function showPage(req, res) {
  res.render('pages/packaging', { title: 'مواد التغليف' });
}

async function getAll(req, res, next) {
  try {
    const items = await PackagingItem.getAll();
    return res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function search(req, res, next) {
  try {
    const query = req.query.q;
    const items = await PackagingItem.search(query);
    return res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = req.body;
    const item = await PackagingItem.create(data);
    return res.status(201).json({ success: true, message: 'تم إضافة مادة التغليف بنجاح', data: item });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const item = await PackagingItem.update(id, data);
    return res.json({ success: true, message: 'تم تعديل مادة التغليف بنجاح', data: item });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await PackagingItem.delete(id);
    return res.json({ success: true, message: 'تم حذف مادة التغليف بنجاح' });
  } catch (error) {
    next(error);
  }
}

async function addQuantity(req, res, next) {
  try {
    const id = req.params.id;
    const { quantity, notes } = req.body || {};

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'الكمية يجب أن تكون رقما صحيحا أكبر من صفر'
      });
    }

    const current = await PackagingItem.getById(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'مادة التغليف غير موجودة' });
    }

    const balanceBefore = Number(current.quantity) || 0;
    const updated = await PackagingItem.addQuantity(id, qty);
    const balanceAfter = Number(updated.quantity) || 0;

    await Transaction.create({
      item_type: 'packaging',
      item_id: id,
      product_size_id: null,
      transaction_type: 'IN',
      quantity: qty,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      supplier_or_receiver: null,
      reason: 'إضافة كمية',
      notes: notes || null,
      created_by: req.session.user ? req.session.user.id : null
    });

    return res.status(201).json({
      success: true,
      message: 'تمت إضافة الكمية بنجاح',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

async function deductQuantity(req, res, next) {
  try {
    const id = req.params.id;
    const { quantity, reason, notes } = req.body || {};

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'الكمية يجب أن تكون رقما صحيحا أكبر من صفر'
      });
    }

    const current = await PackagingItem.getById(id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'مادة التغليف غير موجودة' });
    }

    if (Number(current.quantity) < qty) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن صرف كمية أكبر من الرصيد المتاح'
      });
    }

    const balanceBefore = Number(current.quantity) || 0;
    const updated = await PackagingItem.deductQuantity(id, qty);
    const balanceAfter = Number(updated.quantity) || 0;

    await Transaction.create({
      item_type: 'packaging',
      item_id: id,
      product_size_id: null,
      transaction_type: 'OUT',
      quantity: qty,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      supplier_or_receiver: null,
      reason: reason || 'صرف كمية',
      notes: notes || null,
      created_by: req.session.user ? req.session.user.id : null
    });

    return res.json({
      success: true,
      message: 'تم صرف الكمية بنجاح',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showPage,
  getAll,
  search,
  create,
  update,
  delete: remove,
  addQuantity,
  deductQuantity
};
