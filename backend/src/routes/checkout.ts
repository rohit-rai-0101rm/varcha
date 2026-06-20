import { Router } from 'express';
import express from 'express';
import { createOrder, verifyPayment, webhook } from '../controllers/checkoutController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Webhook must receive raw body for HMAC verification — mount before json middleware
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

router.post('/create-order', optionalAuth, createOrder);
router.post('/verify-payment', optionalAuth, verifyPayment);

export default router;
