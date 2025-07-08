import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import { getUserOrders, placeOrder, getAllOrders, placeOrderStripe } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);           // Place order (COD)
orderRouter.post('/stripe', authUser, placeOrderStripe);    // Place order with Stripe
orderRouter.get('/user', authUser, getUserOrders);          // User's orders
orderRouter.get('/seller', authSeller, getAllOrders);       // Seller/admin orders

export default orderRouter;
