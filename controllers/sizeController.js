'use strict';

const ProductSize = require('../models/ProductSize');
const Product = require('../models/Product');

async function showPage(req, res, next) {
  try {
    const productId = req.params.id;
    const product = await Product.getById(productId);
    
    if (!product) {
      return res.status(404).render('pages/404', { title: 'غير موجود' }); // Or standard error
    }

    res.render('pages/product-sizes', { 
      title: `مقاسات - ${product.model_name}`,
      product
    });
  } catch (error) {
    next(error);
  }
}

async function getAll(req, res, next) {
  try {
    const productId = req.params.id;
    const sizes = await ProductSize.getByProductId(productId);
    return res.json({ success: true, data: sizes });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const productId = req.params.id;
    const data = req.body;
    const size = await ProductSize.create(productId, data);
    return res.status(201).json({ success: true, message: 'تم إضافة المقاس بنجاح', data: size });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const sizeId = req.params.id;
    // We only update size and minimum_quantity, not quantity (quantity is updated via transactions)
    const data = {
      size: req.body.size,
      minimum_quantity: req.body.minimum_quantity
    };
    const size = await ProductSize.update(sizeId, data);
    return res.json({ success: true, message: 'تم تعديل المقاس بنجاح', data: size });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const sizeId = req.params.id;
    await ProductSize.delete(sizeId);
    return res.json({ success: true, message: 'تم حذف المقاس بنجاح' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showPage,
  getAll,
  create,
  update,
  delete: remove
};
