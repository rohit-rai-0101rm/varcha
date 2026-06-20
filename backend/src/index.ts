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

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(attachSession);

app.use('/api', healthRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/styles', stylesRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/wishlist', wishlistRouter);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
});
