import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import Order from './models/Order.js'; // Adjust if the path is different

const fixAddressType = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL; // ✅ use correct variable name

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    const orders = await Order.find({ address: { $type: 'string' } });

    console.log(`Found ${orders.length} orders with string address.`);

    for (const order of orders) {
      await Order.updateOne(
        { _id: order._id },
        { $set: { address: new ObjectId(order.address) } }
      );
      console.log(`✅ Fixed order ${order._id}`);
    }

    console.log('✅ All string addresses converted to ObjectIds.');
    process.exit();
  } catch (err) {
    console.error('Error fixing address:', err);
    process.exit(1);
  }
};

fixAddressType();
