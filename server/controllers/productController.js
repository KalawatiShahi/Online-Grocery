import Product from '../models/Product.js';
import { cloudinary } from '../configs/cloudinary.js';
import fs from 'fs';

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const { productData } = req.body;
    const parsedData = JSON.parse(productData);
    const imageUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'greencart/products',
      });
      imageUrls.push(result.secure_url);
      fs.unlinkSync(file.path); // Delete local file after upload
    }

    const newProduct = new Product({
      ...parsedData,
      images: imageUrls,
    });

    await newProduct.save();
    res.json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET ALL PRODUCTS
export const productList = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET PRODUCT BY ID
export const productById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CHANGE STOCK STATUS
export const changeStock = async (req, res) => {
  try {
    const { productId, inStock } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { inStock },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Stock updated', product: updatedProduct });
  } catch (error) {
    console.error('Error updating stock:', error.message);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated', product: updatedProduct });
  } catch (error) {
    console.error('Update Error:', error.message);
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete Error:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};
