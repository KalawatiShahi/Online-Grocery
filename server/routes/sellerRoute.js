import express from 'express';
import { sellerToken, isSellerAuth, sellerLogout } from '../controllers/sellerController.js';

const router = express.Router();

// Seller login
router.post('/login', sellerToken);

// Check auth
router.get('/auth', isSellerAuth);

// Logout
router.get('/logout', sellerLogout);

export default router;
