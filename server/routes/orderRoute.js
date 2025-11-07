import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import {
  getUserOrders,
  placeOrder,
  getAllOrders,
  placeOrderStripe,
  deleteOrder
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/place', authUser, placeOrder);           // Place order (COD)
orderRouter.post('/stripe', authUser, placeOrderStripe);    // Place order with Stripe
orderRouter.get('/user', authUser, getUserOrders);          // Get orders for logged-in user

// Seller/Admin routes
orderRouter.get('/seller', authSeller, getAllOrders);       // Get all orders for seller/admin
orderRouter.delete('/seller/:id', authSeller, deleteOrder); // Delete order by seller/admin

export default orderRouter;
