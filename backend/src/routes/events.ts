import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { logEvent } from '../controllers/eventController';

const router = Router();

router.post('/', optionalAuth, logEvent);

export default router;
