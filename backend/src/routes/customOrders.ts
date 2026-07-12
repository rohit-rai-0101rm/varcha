import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import * as ctrl from '../controllers/customOrderController';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.post('/', ctrl.create);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/upload', upload.single('file') as any, ctrl.uploadReferenceImage);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'File too large — maximum size is 10 MB' });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
});

export default router;
