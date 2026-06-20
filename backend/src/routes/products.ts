import { Router } from 'express';
import * as productController from '../controllers/productController';

const router = Router();

router.get('/', productController.list);
router.get('/:slug', productController.getBySlug);

export default router;
