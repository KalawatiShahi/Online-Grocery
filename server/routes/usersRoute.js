// routes/userRoutes.js
import express from 'express';
import authUser from '../middleware/authUser.js';
import User from '../models/userModel.js';

const router = express.Router();

// @desc    Check user authentication and return user data
// @route   GET /api/user/is-auth
// @access  Private (requires JWT)
router.get('/is-auth', authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cartItems: user.cartItems || {},
      },
    });
  } catch (error) {
    console.error('is-auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
