import type { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export async function list(_req: Request, res: Response) {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

export async function getBySlug(req: Request, res: Response) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
}
