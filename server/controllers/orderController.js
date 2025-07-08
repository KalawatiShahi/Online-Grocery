import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { cloudinary } from "../configs/cloudinary.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Place Order (Cash on Delivery)
export const placeOrder = async (req, res) => {
  try {
    const { userId, addressId, items } = req.body;
    if (!userId || !addressId || !items?.length) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      amount += product.offerPrice * item.quantity;
    }

    await Order.create({
      userId,
      items,
      amount,
      address: addressId,
      paymentType: "COD",
      isPaid: false,
    });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.error("Error in placeOrder:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Place Order (Stripe Online Payment)
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, addressId, items } = req.body;
    const { origin } = req.headers;

    if (!userId || !addressId || !items?.length) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const productData = [];
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      amount += product.offerPrice * item.quantity;
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      userId,
      items,
      amount,
      address: addressId,
      paymentType: "Online",
      isPaid: false,
    });

    const line_items = productData.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error("Error in placeOrderStripe:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Stripe Webhook Handler
export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      try {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paymentIntentId: session.payment_intent,
          paymentDate: new Date(),
        });

        console.log("✅ Stripe payment completed. Order marked as paid.");
      } catch (err) {
        console.error("❌ Could not update order:", err);
      }

      break;
    }

    default:
      console.warn(`Unhandled event type: ${event.type}`);
      break;
  }

  res.json({ received: true });
};

// Get Orders for a User
export const getUserOrders = async (req, res) => {
  try {
    let orders = await Order.find({ userId: req.userId })
      .populate({
        path: "items.product",
        select: "name category image offerPrice",
      })
      .populate("address");

    orders = orders.map(order => {
      order.items = order.items.map(item => {
        if (item.product && Array.isArray(item.product.image)) {
          item.product.image = item.product.image.map(publicId =>
            cloudinary.url(publicId, { width: 150, height: 150, crop: "fill" })
          );
        }
        return item;
      });
      return order;
    });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("userId")
      .populate("address")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ getAllOrders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
