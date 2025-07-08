import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import {
  addProduct,
  changeStock,
  productById,
  productList,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const productRouter = express.Router();

// Add product with image upload
productRouter.post('/add', authSeller, upload.array('images', 5), addProduct);

// Get all products
productRouter.get('/list', productList);

// Get single product by ID
productRouter.get('/list/:id', productById);

// Change stock (inStock toggle)
productRouter.post('/stock', authSeller, changeStock);

// ✅ Update product (e.g., name, price, etc.)
productRouter.put('/update/:id', authSeller, updateProduct);

// ✅ Delete product by ID
productRouter.delete('/delete/:id', authSeller, deleteProduct);

export default productRouter;
