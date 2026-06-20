import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as wl from '../controllers/wishlistController';

const router = Router();

router.use(requireAuth);

router.get('/', wl.getWishlist);
router.post('/:productId', wl.addToWishlist);
router.delete('/:productId', wl.removeFromWishlist);

export default router;
