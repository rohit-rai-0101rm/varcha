import { Router, Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { requireAdmin } from '../middleware/auth';
import * as ctrl from '../controllers/adminController';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

// Auth
router.post('/auth/login', ctrl.login);
router.get('/auth/me', requireAdmin, ctrl.me);

// Products
router.get('/products', requireAdmin, ctrl.listProducts);
router.post('/products', requireAdmin, ctrl.createProduct);
router.get('/products/:id', requireAdmin, ctrl.getProduct);
router.put('/products/:id', requireAdmin, ctrl.updateProduct);
router.delete('/products/:id', requireAdmin, ctrl.deleteProduct);

// Categories
router.get('/categories', requireAdmin, ctrl.listCategories);
router.post('/categories', requireAdmin, ctrl.createCategory);
router.put('/categories/:id', requireAdmin, ctrl.updateCategory);
router.delete('/categories/:id', requireAdmin, ctrl.deleteCategory);

// Styles
router.get('/styles', requireAdmin, ctrl.listStyles);
router.post('/styles', requireAdmin, ctrl.createStyle);
router.put('/styles/:id', requireAdmin, ctrl.updateStyle);
router.delete('/styles/:id', requireAdmin, ctrl.deleteStyle);

// Banners
router.get('/banners', requireAdmin, ctrl.listBanners);
router.post('/banners', requireAdmin, ctrl.createBanner);
router.put('/banners/:id', requireAdmin, ctrl.updateBanner);
router.patch('/banners/:id/toggle', requireAdmin, ctrl.toggleBanner);
router.delete('/banners/:id', requireAdmin, ctrl.deleteBanner);

// Orders
router.get('/orders', requireAdmin, ctrl.listOrders);
router.patch('/orders/:id/status', requireAdmin, ctrl.updateOrderStatus);

// Settings
router.get('/settings', requireAdmin, ctrl.getSettings);
router.put('/settings', requireAdmin, ctrl.updateSettings);

// Analytics
router.get('/analytics', requireAdmin, ctrl.getOverview);
router.get('/analytics/sessions', requireAdmin, ctrl.getTopSessions);

// Customers
router.get('/customers', requireAdmin, ctrl.listCustomers);
router.get('/customers/:userId', requireAdmin, ctrl.getCustomerDetail);

// Image upload → Cloudinary
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/upload', requireAdmin, upload.single('file') as any, ctrl.uploadImage);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'File too large — maximum size is 10 MB' });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
});

export default router;
