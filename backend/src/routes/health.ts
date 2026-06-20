import { Router } from 'express';
import { getDbStatus } from '../db';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', db: getDbStatus() });
});

export default router;
