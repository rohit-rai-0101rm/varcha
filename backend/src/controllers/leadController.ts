import type { Request, Response } from 'express';
import * as leadService from '../services/leadService';

export async function create(req: Request, res: Response) {
  try {
    const { name, phone, email } = req.body;
    if (!name?.trim() || !phone?.trim()) {
      res.status(400).json({ message: 'Name and phone are required' });
      return;
    }
    const lead = await leadService.createLead({ name: name.trim(), phone: phone.trim(), email: email?.trim() });
    res.status(201).json(lead);
  } catch {
    res.status(500).json({ message: 'Failed to save — please try again' });
  }
}
