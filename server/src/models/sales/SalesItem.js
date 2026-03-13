const mongoose = require('mongoose');

const salesItemSchema = new mongoose.Schema({
  sales_order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesOrder',
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total_price: { type: Number, required: true },
});

module.exports = mongoose.model('SalesItem', salesItemSchema);
