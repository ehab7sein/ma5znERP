'use strict';

const Product = require('../models/Product');

function showPage(req, res) {
  res.render('pages/products', { title: 'موديلات الأحذية' });
}

async function getAll(req, res, next) {
  try {
    const products = await Product.getAllWithSizes();
    // Calculate totals for each product
    const mapped = products.map(p => {
      const sizes = p.product_sizes || [];
      const totalQuantity = sizes.reduce((sum, size) => sum + (size.quantity || 0), 0);
      return {
        ...p,
        sizes_count: sizes.length,
        total_quantity: totalQuantity
      };
    });
    return res.json({ success: true, data: mapped });
  } catch (error) {
    next(error);
  }
}

async function search(req, res, next) {
  try {
    const query = req.query.q;
    const products = await Product.search(query);
    return res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = req.body;
    const product = await Product.create(data);
    return res.status(201).json({ success: true, message: 'تم إضافة الموديل بنجاح', data: product });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = await Product.update(id, data);
    return res.json({ success: true, message: 'تم تعديل الموديل بنجاح', data: product });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const id = req.params.id;
    await Product.delete(id);
    return res.json({ success: true, message: 'تم حذف الموديل بنجاح' });
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
  delete: remove
};
