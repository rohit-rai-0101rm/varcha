import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import express from 'express';
import cors from 'cors';
import { connectDb } from './db';
import healthRouter from './routes/health';
import categoriesRouter from './routes/categories';
import stylesRouter from './routes/styles';
import productsRouter from './routes/products';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/styles', stylesRouter);
app.use('/api/products', productsRouter);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
});
