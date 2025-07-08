import User from "../models/User.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("cartItems");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, cartItems: user.cartItems || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(req.userId, { cartItems });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
