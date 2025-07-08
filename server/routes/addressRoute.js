import express from 'express';
import { addAddress, getAddress } from '../controllers/addressController.js';
import authUser from '../middlewares/authUser.js';

const router = express.Router();

router.post('/add', authUser, addAddress);
router.get('/get', authUser, getAddress); // ✅ this was failing before because getAddress was missing

export default router;
