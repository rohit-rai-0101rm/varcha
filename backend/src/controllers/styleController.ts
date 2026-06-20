import type { Request, Response } from 'express';
import * as styleService from '../services/styleService';

export async function list(_req: Request, res: Response) {
  try {
    const styles = await styleService.listStyles();
    res.json(styles);
  } catch {
    res.status(500).json({ error: 'Failed to fetch styles' });
  }
}

export async function getBySlug(req: Request, res: Response) {
  try {
    const style = await styleService.getStyleBySlug(req.params.slug);
    if (!style) {
      res.status(404).json({ error: 'Style not found' });
      return;
    }
    res.json(style);
  } catch {
    res.status(500).json({ error: 'Failed to fetch style' });
  }
}
