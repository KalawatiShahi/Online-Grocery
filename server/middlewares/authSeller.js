// middlewares/authSeller.js
import jwt from 'jsonwebtoken';

const authSeller = (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: 'Not Authorized: No token' });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (decoded.email === process.env.SELLER_EMAIL) {
      req.isSeller = true;
      req.sellerEmail = decoded.email; // Set sellerEmail for filtering orders
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Not Authorized: Invalid seller' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
  }
};

export default authSeller;
