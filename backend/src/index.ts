import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import express from 'express';
import cors from 'cors';
import { connectDb } from './db';
import { attachSession } from './middleware/auth';
import healthRouter from './routes/health';
import categoriesRouter from './routes/categories';
import stylesRouter from './routes/styles';
import productsRouter from './routes/products';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import wishlistRouter from './routes/wishlist';
import checkoutRouter from './routes/checkout';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';
import { getSettings } from './services/adminService';
import Banner from './models/Banner';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: true, credentials: true }));
// Raw body for Razorpay webhook HMAC — must come before express.json()
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(attachSession);

app.use('/api', healthRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/styles', stylesRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.get('/api/settings', async (_req, res) => {
  try { res.json(await getSettings()); } catch { res.status(500).json({ message: 'Server error' }); }
});

app.get('/api/banners', async (req, res) => {
  try {
    const { position } = req.query as { position?: string };
    const filter: Record<string, unknown> = { isActive: true };
    if (position) filter.position = position;
    const banners = await Banner.find(filter).sort({ createdAt: -1 });
    res.json(banners);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
});
