const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    product_name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String },
    description: { type: String },
    cost_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    stock_quantity: { type: Number, default: 0 },
    minimum_stock: { type: Number, default: 0 },
    unit: { type: String }, // e.g., pcs, kg, box
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Product', productSchema);
