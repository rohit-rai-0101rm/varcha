import { Router } from 'express';
import * as ctrl from '../controllers/leadController';

const router = Router();

router.post('/', ctrl.create);

export default router;
