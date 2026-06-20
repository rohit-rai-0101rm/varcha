import { Router } from 'express';
import * as styleController from '../controllers/styleController';

const router = Router();

router.get('/', styleController.list);
router.get('/:slug', styleController.getBySlug);

export default router;
