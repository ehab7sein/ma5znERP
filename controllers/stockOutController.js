'use strict';

const ProductSize = require('../models/ProductSize');
const Transaction = require('../models/Transaction');

function showForm(req, res) {
  res.render('pages/stock-out', { title: 'صرف مخزون' });
}

async function processStockOut(req, res, next) {
  try {
    const {
      product_id,
      product_size_id,
      quantity,
      receiver,
      reason,
      notes
    } = req.body;

    const qty = Number(quantity);

    if (!product_size_id || !qty || qty <= 0) {
      return res.status(400).json({ success: false, message: 'بيانات غير مكتملة أو كمية غير صحيحة' });
    }

    // 1. Get current balance
    const sizeData = await ProductSize.getById(product_size_id);
    if (!sizeData) {
      return res.status(404).json({ success: false, message: 'المقاس غير موجود' });
    }

    const currentBalance = sizeData.quantity;

    // 2. Check if enough stock
    if (qty > currentBalance) {
      return res.status(400).json({ success: false, message: 'الكمية المطلوبة أكبر من المتوفر' });
    }

    // 3. Deduct quantity
    await ProductSize.deductQuantity(product_size_id, qty);
    
    // 4. Create transaction record
    await Transaction.create({
      item_type: 'shoe',
      item_id: product_id,
      product_size_id: product_size_id,
      transaction_type: 'OUT',
      quantity: qty,
      balance_before: currentBalance,
      balance_after: currentBalance - qty,
      supplier_or_receiver: receiver,
      reason: reason,
      notes: notes,
      created_by: req.user ? req.user.username : 'admin'
    });

    return res.json({ success: true, message: 'تم صرف الكمية بنجاح' });
  } catch (error) {
    if (error.message.includes('أكبر من الرصيد المتاح') || error.message.includes('أكبر من المتوفر')) {
        return res.status(400).json({ success: false, message: 'الكمية المطلوبة أكبر من المتوفر' });
    }
    next(error);
  }
}

module.exports = {
  showForm,
  processStockOut
};
