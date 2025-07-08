import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { stripeWebhookHandler } from './controllers/orderController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

(async () => {
  await connectDB();

  const allowedOrigins = ['http://localhost:5173'];

  app.post('/stripe', express.raw({type: 'application/json'}),stripeWebhookHandler)

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: allowedOrigins, credentials: true }));

  // Serve React build static files
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('/', (req, res) => res.send("API is Working"));

  app.use('/api/user', userRouter);
  app.use('/api/seller', sellerRouter);
  app.use('/api/product', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/address', addressRouter);
  app.use('/api/orders', orderRouter);

  // Catch-all route to serve React app for non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});





//cd D:\GreenCart\server
//npm run server