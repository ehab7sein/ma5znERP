'use strict';

const Product = require('../models/Product');
const ProductSize = require('../models/ProductSize');
const Transaction = require('../models/Transaction');

function showForm(req, res, next) {
  return res.render('pages/stock-in', {
    title: 'إضافة مخزون'
  });
}

async function getSizesByProduct(req, res, next) {
  try {
    const productId = req.params.id;
    const product = await Product.getById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'الموديل غير موجود'
      });
    }

    const sizes = await ProductSize.getByProductId(productId);

    return res.json({
      success: true,
      data: {
        product,
        sizes
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function processStockIn(req, res, next) {
  try {
    const { product_id, product_size_id, quantity, supplier, notes } = req.body || {};

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'الموديل مطلوب'
      });
    }

    if (!product_size_id) {
      return res.status(400).json({
        success: false,
        message: 'المقاس مطلوب'
      });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'الكمية يجب أن تكون رقما صحيحا أكبر من صفر'
      });
    }

    const size = await ProductSize.getById(product_size_id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'المقاس غير موجود'
      });
    }

    if (String(size.product_id) !== String(product_id)) {
      return res.status(400).json({
        success: false,
        message: 'المقاس لا ينتمي إلى الموديل المختار'
      });
    }

    const balanceBefore = Number(size.quantity) || 0;
    const updatedSize = await ProductSize.addQuantity(product_size_id, qty);
    const balanceAfter = Number(updatedSize.quantity) || 0;

    const transaction = await Transaction.create({
      item_type: 'shoe',
      item_id: product_id,
      product_size_id: product_size_id,
      transaction_type: 'IN',
      quantity: qty,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      supplier_or_receiver: supplier || null,
      reason: 'إضافة مخزون',
      notes: notes || null,
      created_by: req.session.user ? req.session.user.id : null
    });

    return res.status(201).json({
      success: true,
      message: 'تمت إضافة الكمية بنجاح',
      data: {
        size: updatedSize,
        transaction
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  showForm,
  getSizesByProduct,
  processStockIn
};
