import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function signup(req: Request, res: Response) {
  const { name, email, phone, password, marketingConsent } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400).json({ message: 'name, email, phone, and password are required' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters' });
    return;
  }

  try {
    const result = await authService.signup({ name, email, phone, password, marketingConsent });
    res.status(201).json(result);
  } catch (err: any) {
    if (err.message === 'EMAIL_TAKEN') {
      res.status(409).json({ message: 'An account with this email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' });
    return;
  }

  try {
    const result = await authService.login({ email, password }, req.sessionId);
    res.json(result);
  } catch (err: any) {
    if (err.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export async function me(req: Request, res: Response) {
  try {
    const user = await authService.getMe(req.auth!.userId);
    res.json(user);
  } catch (err: any) {
    if (err.message === 'NOT_FOUND') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export function logout(_req: Request, res: Response) {
  res.json({ message: 'ok' });
}
