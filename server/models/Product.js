import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: [String], required: true },  // Split lines as array
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  images: { type: [String], required: true },       // FIXED: should be 'images'
  category: { type: String, required: true },        // FIXED: should be a string
  inStock: { type: Boolean, default: true },
 

}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
