import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getCart, updateCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', authUser, getCart);
router.post('/update', authUser, updateCart);

export default router;
