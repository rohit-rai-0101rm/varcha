import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';

const router = Router();

router.get('/', categoryController.list);
router.get('/:slug', categoryController.getBySlug);

export default router;
