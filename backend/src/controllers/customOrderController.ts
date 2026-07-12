import type { Request, Response } from 'express';
import * as customOrderService from '../services/customOrderService';
import { uploadToCloudinary } from '../services/uploadService';

export async function create(req: Request, res: Response) {
  try {
    const { name, phone, email, occasion, budgetRange, preferredStone, referenceImageUrl, message } = req.body;
    if (!name?.trim() || !phone?.trim()) {
      res.status(400).json({ message: 'Name and phone are required' });
      return;
    }
    const request = await customOrderService.createCustomOrderRequest({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      occasion: occasion?.trim(),
      budgetRange: budgetRange?.trim(),
      preferredStone: preferredStone?.trim(),
      referenceImageUrl: referenceImageUrl?.trim(),
      message: message?.trim(),
    });
    res.status(201).json(request);
  } catch {
    res.status(500).json({ message: 'Failed to save — please try again' });
  }
}

export async function uploadReferenceImage(req: Request, res: Response) {
  try {
    if (!req.file) { res.status(400).json({ message: 'No file received' }); return; }
    if (!req.file.mimetype.startsWith('image/')) {
      res.status(400).json({ message: 'Only image files are accepted' });
      return;
    }
    const url = await uploadToCloudinary(req.file.buffer, 'varcha/custom-orders');
    res.json({ url });
  } catch {
    res.status(500).json({ message: 'Upload failed — please try again' });
  }
}
