import { Router } from 'express';
import { getMyOrders, getOrderById } from '../controllers/orderController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getMyOrders);
router.get('/:id', requireAuth, getOrderById);

export default router;
